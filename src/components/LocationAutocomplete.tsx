"use client";

import { useEffect, useRef } from "react";
import { FEATURE_FLAGS } from "@/lib/featureFlags";

type LocationAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (placeName: string) => void;
  placeholder?: string;
  className?: string;
  onEnter?: () => void;
};

/** Mirrors legacy `types: ["(regions)"]` — cities, states, countries */
const REGION_PRIMARY_TYPES = [
  "locality",
  "administrative_area_level_1",
  "country",
] as const;

const PLACE_FETCH_FIELDS = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
] as const;

type PlacePredictionLike = {
  toPlace: () => PlaceLike;
};

type PlaceLike = {
  fetchFields: (opts: { fields: readonly string[] }) => Promise<unknown>;
  formattedAddress?: string;
  displayName?: string;
};

type GmpSelectEvent = Event & { placePrediction?: PlacePredictionLike };

type GoogleMapsBootstrap = {
  importLibrary: (name: string) => Promise<unknown>;
  places: {
    PlaceAutocompleteElement: new (opts?: object) => HTMLElement;
  };
};

declare global {
  interface Window {
    google?: { maps: GoogleMapsBootstrap };
  }
}

function getInnerTextInput(
  host: HTMLElement & { shadowRoot?: ShadowRoot | null }
): HTMLInputElement | null {
  return host.shadowRoot?.querySelector("input") ?? null;
}

export function LocationAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  placeholder = "Enter a destination...",
  className = "",
  onEnter,
}: LocationAutocompleteProps) {
  const plainInputRef = useRef<HTMLInputElement>(null);
  const placesHostRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLElement | null>(null);

  const onChangeRef = useRef(onChange);
  const onPlaceSelectedRef = useRef(onPlaceSelected);
  const onEnterRef = useRef(onEnter);
  onChangeRef.current = onChange;
  onPlaceSelectedRef.current = onPlaceSelected;
  onEnterRef.current = onEnter;

  const placeholderRef = useRef(placeholder);
  placeholderRef.current = placeholder;

  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    if (!FEATURE_FLAGS.GOOGLE_PLACES_AUTOCOMPLETE) {
      return;
    }

    const root = placesHostRef.current;
    if (!root) {
      return;
    }

    let cancelled = false;

    const cleanupWidget = () => {
      const w = widgetRef.current;
      const extended = w as (HTMLElement & { __lumitripDetach?: () => void }) | null;
      extended?.__lumitripDetach?.();
      if (w?.parentNode) {
        w.parentNode.removeChild(w);
      }
      widgetRef.current = null;
      root.replaceChildren();
    };

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });

    void (async () => {
      while (!cancelled && !widgetRef.current) {
        if (typeof window === "undefined") {
          await sleep(100);
          continue;
        }
        const maps = window.google?.maps;
        if (!maps?.importLibrary) {
          await sleep(100);
          continue;
        }

        try {
          await maps.importLibrary("places");
        } catch {
          if (cancelled) {
            return;
          }
          await sleep(100);
          continue;
        }

        if (cancelled || !placesHostRef.current || widgetRef.current) {
          return;
        }

        let widget: HTMLElement;
        try {
          const typedMaps = window.google!.maps as GoogleMapsBootstrap;
          const { PlaceAutocompleteElement } = typedMaps.places;
          widget = new PlaceAutocompleteElement({
            includedPrimaryTypes: [...REGION_PRIMARY_TYPES],
          });
        } catch {
          if (cancelled) {
            return;
          }
          await sleep(100);
          continue;
        }

        widget.setAttribute("placeholder", placeholderRef.current);
        widget.style.width = "100%";
        widget.style.display = "block";
        widget.style.boxSizing = "border-box";

        root.appendChild(widget);
        widgetRef.current = widget;

        const handleGmpSelect = async (ev: Event) => {
          const e = ev as GmpSelectEvent;
          const prediction = e.placePrediction;
          if (!prediction) {
            return;
          }
          try {
            const place = prediction.toPlace() as PlaceLike;
            await place.fetchFields({ fields: PLACE_FETCH_FIELDS });
            const label =
              place.formattedAddress ?? place.displayName ?? "";
            if (label) {
              onPlaceSelectedRef.current(label);
              onChangeRef.current(label);
            }
          } catch {
            /* ignore malformed responses */
          }
        };

        const syncTypingFromShadow = () => {
          const inputEl = getInnerTextInput(widget);
          if (inputEl) {
            onChangeRef.current(inputEl.value);
          }
        };

        const handleKeyDown = (ev: Event) => {
          if ((ev as KeyboardEvent).key === "Enter") {
            onEnterRef.current?.();
          }
        };

        const handleBlur = () => {
          const inputEl = getInnerTextInput(widget);
          const current = inputEl?.value ?? "";
          if (current) {
            onChangeRef.current(current);
          }
        };

        widget.addEventListener("gmp-select", handleGmpSelect);
        widget.addEventListener("input", syncTypingFromShadow, true);
        widget.addEventListener("keydown", handleKeyDown, true);
        widget.addEventListener("focusout", handleBlur);

        const detach = () => {
          widget.removeEventListener("gmp-select", handleGmpSelect);
          widget.removeEventListener("input", syncTypingFromShadow, true);
          widget.removeEventListener("keydown", handleKeyDown, true);
          widget.removeEventListener("focusout", handleBlur);
        };

        (widget as HTMLElement & { __lumitripDetach?: () => void }).__lumitripDetach =
          detach;

        requestAnimationFrame(() => {
          const inputEl = getInnerTextInput(widget);
          if (inputEl) {
            inputEl.value = valueRef.current;
          }
        });

        break;
      }
    })();

    return () => {
      cancelled = true;
      cleanupWidget();
    };
  }, []);

  useEffect(() => {
    if (!FEATURE_FLAGS.GOOGLE_PLACES_AUTOCOMPLETE) {
      return;
    }
    const w = widgetRef.current;
    if (!w) {
      return;
    }
    w.setAttribute("placeholder", placeholder);
  }, [placeholder]);

  useEffect(() => {
    if (!FEATURE_FLAGS.GOOGLE_PLACES_AUTOCOMPLETE) {
      return;
    }
    const w = widgetRef.current;
    if (!w) {
      return;
    }
    const inputEl = getInnerTextInput(w);
    if (inputEl && inputEl.value !== value) {
      inputEl.value = value;
    }
  }, [value]);

  if (!FEATURE_FLAGS.GOOGLE_PLACES_AUTOCOMPLETE) {
    return (
      <input
        ref={plainInputRef}
        type="text"
        value={value}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onEnter?.();
          }
        }}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => {
          const currentValue = e.target.value;
          if (currentValue && currentValue !== value) {
            onChange(currentValue);
            onPlaceSelected(currentValue);
          }
        }}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
    );
  }

  return (
    <div
      ref={placesHostRef}
      className={className}
      style={{ minWidth: 0 }}
    />
  );
}
