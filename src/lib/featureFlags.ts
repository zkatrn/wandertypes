/**
 * Feature Flags
 * 
 * Toggle features on/off during development to save costs or test different behaviors.
 */

export const FEATURE_FLAGS = {
  /**
   * Google Places Autocomplete
   * Set to false during development to avoid API costs
   */
  GOOGLE_PLACES_AUTOCOMPLETE: false,
  
  /**
   * Firebase Analytics
   * Set to false to disable analytics tracking
   */
  FIREBASE_ANALYTICS: false,
} as const;
