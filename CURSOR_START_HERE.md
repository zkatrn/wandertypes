# CURSOR_START_HERE.md

# Lumitrip — Cursor Kickoff Prompt

Copy/paste the prompt below into Cursor Chat or Cursor Agent after you place the project docs into your repo.

You can edit the file paths if your docs live somewhere else.

---

# Initial Cursor Prompt

```text
You are helping me build a new Next.js app called Lumitrip.

Lumitrip is a warm, friendly, emotionally-aware travel planning app. The MVP is a survey-first experience where a user answers reflective travel questions, signs in with Google, and receives a personalized destination/activity comparison page with a theme selected from their answers.

Before writing code, read the project documents in this order in this directory /Users/kzivkovic/Documents/LumiTrip:

1. ./DO_THIS.md
   - This is the immediate setup checklist and practical implementation guide.
   - Treat this as the highest-priority setup document.

2. ./ARD.md
   - This contains the architecture requirements and MVP structure.
   - Use this to understand the intended app flow, tech stack, and implementation boundaries.

3. ./SURVEY_DESIGN.md
   - This defines the survey experience, tone, question style, and flow.
   - The survey should feel psychologically engaging, friendly, and low-pressure.
   - Keep pages short: ideally 3–5 questions per page.

4. ./THEMES.md
   - This defines the visual theme system.
   - The app should select one of the predefined themes based on the user’s survey answers.
   - Themes should affect colors, mood, icon choices, and result page styling.

5. ./MASCOT_AND_ICONS.md
   - This defines the mascot direction and icon usage.
   - Use Lucide React icons unless otherwise specified.
   - The mascot is Lumi, a cute travel-guide cat. Do not overcomplicate the first version; placeholders are fine.

6. ./.cursor/rules/product.mdc
7. ./.cursor/rules/frontend.mdc
8. ./.cursor/rules/backend.mdc
9. ./.cursor/rules/ai-trip-interpreter.mdc
   - These are project rules. Follow them throughout implementation.

After reading the documents, summarize your understanding of:

- the MVP goal
- the user flow
- the tech stack
- the Firebase/Auth/Firestore plan
- the AI Trip Interpreter plan
- the UI/theme/mascot direction
- the files you expect to create first

Then ask me before making broad architectural changes.

For the first implementation pass, focus only on this milestone:

MILESTONE 1:
- Create the Next.js app structure if it does not exist yet.
- Set up a clean folder structure under src/.
- Add Firebase initialization in src/lib/firebase.ts.
- Add a basic app shell.
- Add a landing page.
- Add a multi-page survey flow with local/session caching.
- Add placeholder Google sign-in UI.
- Add placeholder result page that uses mock survey answers.
- Add initial theme tokens for 5–6 travel archetypes.
- Add Lucide icons where helpful.
- Add Framer Motion lightly for page transitions.

Do NOT build everything at once.
Do NOT add Airbnb scraping.
Do NOT add complex backend infrastructure.
Do NOT expose API keys in client code except NEXT_PUBLIC Firebase config values.
Do NOT call OpenAI directly from client components.

Use TypeScript.
Use React components with clear names.
Use Tailwind, but avoid giant unreadable class strings when a component abstraction would be cleaner.
Prefer small, composable components.

The product should feel:
- warm
- friendly
- reflective
- calm
- slightly playful
- visually guided
- not corporate
- not text-heavy

The first magical moment is:

A user answers a fun travel-personality survey and receives a beautiful personalized comparison board that feels like it understood what kind of trip they actually want.

Start by reading the files and summarizing the plan. Then propose the first file changes.
```

---

# Optional Follow-Up Prompt After Cursor Summarizes

Use this after Cursor reads the docs and gives you a plan.

```text
Good. Please implement Milestone 1 now.

Before editing, list the exact files you will create or modify.

Then proceed with the smallest working version:

- landing page
- survey route
- result route
- local cached survey answers
- mock theme selection
- mock destination comparison cards
- placeholder sign-in button
- Firebase config file
- basic reusable components

Keep the code simple and readable. Use placeholder data where needed. Do not integrate OpenAI yet. Do not integrate live travel APIs yet.
```

---

# Optional Prompt For When You Are Ready To Add Firebase Auth

```text
Now implement Firebase Google Auth.

Read ./DO_THIS.md again first, especially the Firebase sections.

Requirements:
- Use Firebase Auth with Google provider.
- Keep Firebase setup in src/lib/firebase.ts.
- Add auth helper functions in src/lib/auth.ts or src/features/auth/.
- Add a sign-in button component.
- Add a sign-out button component.
- Preserve cached survey answers before login.
- After login, route the user to the result page.
- Do not add unnecessary backend infrastructure.
```

---

# Optional Prompt For When You Are Ready To Add Firestore

```text
Now implement Firestore persistence for survey responses and result boards.

Requirements:
- Save survey answers under the authenticated user.
- Save generated result board data separately from raw survey answers.
- Use simple collections and clear TypeScript types.
- Do not over-engineer the schema.
- Add basic error handling.
- Add loading states.
- Keep local/session cached answers as fallback.
```

---

# Optional Prompt For When You Are Ready To Add AI

```text
Now add the AI Trip Interpreter as a server-side route.

Requirements:
- Do not call OpenAI from the client.
- Create a server route or server action.
- Input: structured survey answers.
- Output: structured JSON only.
- The JSON should include:
  - travelArchetype
  - selectedTheme
  - energyLevel
  - travelPacing
  - destinationRecommendations
  - activityRecommendations
  - tradeoffs
  - warnings
  - friendlySummary
- Validate the response shape.
- Store the interpreted result in Firestore only after successful generation.
- Use mock data fallback if the API key is missing.
```

---

# Notes To Self

Recommended repo name:

```text
lumitrip
```

Recommended Firebase project name:

```text
lumitrip-dev
```

Recommended Firebase web app name:

```text
lumitrip-web
```

Keep the first build small. The product does not need to solve all travel planning immediately. The MVP only needs to prove that the survey → personalized result page feels useful and delightful.
