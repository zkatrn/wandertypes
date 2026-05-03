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

declare global {
  interface Window {
    google: any;
  }
}

export function LocationAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  placeholder = "Enter a destination...",
  className = "",
  onEnter,
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!FEATURE_FLAGS.GOOGLE_PLACES_AUTOCOMPLETE) {
      return;
    }
    
    const checkGoogleMaps = () => {
      if (window.google?.maps?.places) {
        setIsLoaded(true);
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };
    checkGoogleMaps();
  }, []);

  useEffect(() => {
    if (!FEATURE_FLAGS.GOOGLE_PLACES_AUTOCOMPLETE) {
      return;
    }
    
    if (!inputRef.current || !isLoaded) {
      console.log("Not ready:", { hasInput: !!inputRef.current, isLoaded });
      return;
    }

    console.log("Initializing autocomplete");
    
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["(regions)"],
        fields: ["name", "formatted_address", "address_components"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      console.log("Place selected:", place);
      if (place.formatted_address) {
        onPlaceSelected(place.formatted_address);
      } else if (place.name) {
        onPlaceSelected(place.name);
      }
    });

    autocompleteRef.current = autocomplete;

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onPlaceSelected]);

  return (
    <input
      ref={inputRef}
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
          // If feature flag is disabled, manually trigger the place selection
          if (!FEATURE_FLAGS.GOOGLE_PLACES_AUTOCOMPLETE) {
            onPlaceSelected(currentValue);
          }
        }
      }}
      placeholder={placeholder}
      className={className}
      autoComplete="off"
    />
  );
}
