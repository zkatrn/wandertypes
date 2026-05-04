"use client";

type LocationAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (placeName: string) => void;
  placeholder?: string;
  className?: string;
  onEnter?: () => void;
};

/**
 * Plain destination input (no third-party autocomplete).
 * Keeps the same props as before so survey steps stay unchanged.
 */
export function LocationAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  placeholder = "Enter a destination...",
  className = "",
  onEnter,
}: LocationAutocompleteProps) {
  return (
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
      className={className}
      autoComplete="off"
    />
  );
}
