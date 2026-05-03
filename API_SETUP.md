# API Setup Guide

## Anthropic API Integration

Your Anthropic API key is already configured in `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

## Trip Interpretation API

The `/api/interpret-trip` route is now set up and ready to use with your Anthropic API key.

### Usage

**Endpoint:** `POST /api/interpret-trip`

**Request Body:**
```json
{
  "surveyAnswers": {
    "tripMood": ["reset", "explore"],
    "travelPacing": "slow_mornings",
    "environment": "natural",
    "groupType": "solo",
    "drivingPreference": "minimal",
    "hotelChangePreference": "one_base",
    "activities": ["hiking", "food"],
    "budgetFeel": "splurge_worthy",
    "additionalNotes": "..."
  },
  "userId": "optional-firebase-uid"
}
```

**Response:**
```json
{
  "interpretation": {
    "archetype": "Relaxation Focused",
    "emotionalGoal": "Reset and recharge",
    "pacingStyle": "Slow and steady",
    "themeKey": "coastal_calm",
    "destinations": [
      {
        "name": "Big Sur, California",
        "scores": {
          "vibeMatch": 5,
          "paceFit": 5,
          "accessibility": 4,
          "budgetValue": 3,
          "airportDistance": 4
        },
        "activities": [
          { "name": "Coastal hiking", "tags": ["nature", "moderate"] }
        ]
      }
    ]
  }
}
```

### Model Used

Currently using: **Claude 3.5 Sonnet** (`claude-3-5-sonnet-20241022`)

This is Anthropic's most intelligent model, perfect for nuanced travel recommendations.

### Next Steps

To integrate this with your results page:

1. Update `src/app/results/page.tsx` to call the API instead of using mock data
2. Add loading states while the AI generates recommendations
3. Handle errors gracefully
4. Consider caching results in Firestore for authenticated users

## Google Maps & Places (New)

`PlaceAutocompleteElement` (survey destination fields) calls **Places API (New)** (`places.googleapis.com`), not only the older “Places API” product.

1. In [Google Cloud Console](https://console.cloud.google.com/), select the project tied to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
2. Enable **Maps JavaScript API** (if not already).
3. Enable **[Places API (New)](https://console.cloud.google.com/apis/library/places.googleapis.com)**. Without this, autocomplete returns `403` and the widget logs that the API is disabled.
4. After enabling, wait a few minutes for propagation, then hard-refresh the site.
5. **API key restrictions:** for browser keys, add HTTP referrers (e.g. `https://www.yourdomain.com/*`, `http://localhost:3000/*` for dev).

The Places UI Kit follows the user’s light/dark OS preference unless overridden; this app forces a **light** appearance for `gmp-place-autocomplete` in `globals.css` so it matches the survey.

### Testing

You can test the API directly:

```bash
curl -X POST http://localhost:3000/api/interpret-trip \
  -H "Content-Type: application/json" \
  -d '{
    "surveyAnswers": {
      "tripMood": ["reset"],
      "travelPacing": "slow_mornings"
    }
  }'
```
