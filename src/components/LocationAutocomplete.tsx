"use client";

import { useEffect, useRef, useState } from "react";
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

/** If Maps never finishes wiring, fall back so the user can still type. */
const PLACES_INIT_TIMEOUT_MS = 12_000;

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

/**
 * One shared `importLibrary("places")` promise per page load.
 * Call only after `window.google.maps.importLibrary` exists (Maps script loads once from layout).
 */
let placesLibraryImportPromise: Promise<unknown> | null = null;

function getPlacesLibraryImport(): Promise<unknown> {
  const maps = window.google!.maps as GoogleMapsBootstrap;
  placesLibraryImportPromise ??= maps.importLibrary("places");
  return placesLibraryImportPromise;
}

function getInnerTextInput(
  host: HTMLElement & { shadowRoot?: ShadowRoot | null }
): HTMLInputElement | null {
  return host.shadowRoot?.querySelector("input") ?? null;
}

function PlainDestinationField({
  value,
  onChange,
  onPlaceSelected,
  placeholder,
  className,
  onEnter,
  showFallbackHint,
}: LocationAutocompleteProps & { showFallbackHint: boolean }) {
  return (
    <div className={`flex flex-col gap-1 min-w-0 ${className}`}>
      <input
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
        className="w-full min-h-[2.75rem] border-0 bg-transparent text-stone-900 outline-none ring-0 placeholder:text-stone-400 focus:ring-0"
        autoComplete="off"
      />
      {showFallbackHint ? (
        <p className="text-left text-xs text-stone-500 px-0.5">
          Map suggestions are unavailable — you can still enter any destination.
        </p>
      ) : null}
    </div>
  );
}

export function LocationAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  placeholder = "Enter a destination...",
  className = "",
  onEnter,
}: LocationAutocompleteProps) {
  const placesHostRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLElement | null>(null);
  const hasInitializedRef = useRef(false);

  const [useNativeFallback, setUseNativeFallback] = useState(false);

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

  const usePlainField =
    !FEATURE_FLAGS.GOOGLE_PLACES_AUTOCOMPLETE || useNativeFallback;

  useEffect(() => {
    if (usePlainField) {
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
      hasInitializedRef.current = false;
    };

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });

    const waitForMapsBootstrap = async (): Promise<boolean> => {
      while (!cancelled) {
        if (
          typeof window !== "undefined" &&
          window.google?.maps?.importLibrary
        ) {
          return true;
        }
        await sleep(50);
      }
      return false;
    };

    const fallbackTimer = window.setTimeout(() => {
      if (cancelled || hasInitializedRef.current) {
        return;
      }
      setUseNativeFallback(true);
    }, PLACES_INIT_TIMEOUT_MS);

    void (async () => {
      const ready = await waitForMapsBootstrap();
      if (!ready || cancelled || !placesHostRef.current) {
        return;
      }

      try {
        await getPlacesLibraryImport();
      } catch {
        if (!cancelled) {
          setUseNativeFallback(true);
        }
        return;
      }

      if (cancelled || !placesHostRef.current) {
        return;
      }

      if (hasInitializedRef.current || widgetRef.current) {
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
        if (!cancelled) {
          setUseNativeFallback(true);
        }
        return;
      }

      if (cancelled || !placesHostRef.current) {
        return;
      }

      widget.setAttribute("placeholder", placeholderRef.current);
      widget.style.width = "100%";
      widget.style.display = "block";
      widget.style.boxSizing = "border-box";

      root.appendChild(widget);
      widgetRef.current = widget;
      hasInitializedRef.current = true;
      window.clearTimeout(fallbackTimer);

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
        if (cancelled) {
          return;
        }
        const inputEl = getInnerTextInput(widget);
        if (inputEl) {
          inputEl.value = valueRef.current;
        }
      });
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      cleanupWidget();
    };
  }, [usePlainField]);

  useEffect(() => {
    if (usePlainField) {
      return;
    }
    const w = widgetRef.current;
    if (!w) {
      return;
    }
    w.setAttribute("placeholder", placeholder);
  }, [placeholder, usePlainField]);

  useEffect(() => {
    if (usePlainField) {
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
  }, [value, usePlainField]);

  if (usePlainField) {
    return (
      <PlainDestinationField
        value={value}
        onChange={onChange}
        onPlaceSelected={onPlaceSelected}
        placeholder={placeholder}
        className={className}
        onEnter={onEnter}
        showFallbackHint={FEATURE_FLAGS.GOOGLE_PLACES_AUTOCOMPLETE}
      />
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div
        ref={placesHostRef}
        className={`places-autocomplete-root ${className}`}
        style={{ minWidth: 0 }}
      />
      <button
        type="button"
        className="self-start text-left text-xs font-medium text-stone-500 underline decoration-stone-300 underline-offset-2 hover:text-stone-700"
        onClick={() => setUseNativeFallback(true)}
      >
        Prefer plain text (no map suggestions)?
      </button>
    </div>
  );
}
