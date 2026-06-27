# SushiMap — Founder Vision

## 1. What It Does

SushiMap helps users find, explore, and review verified all-you-can-eat (AYCE) sushi restaurants. Every listing is confirmed AYCE — no regular sushi spots allowed.

Users can:
- Search by location and browse a map of nearby AYCE restaurants
- Filter by price, hours, and neighborhood
- Leave journal-style reviews with AYCE-specific ratings
- Collect stamps for visited restaurants and unlock neighborhood/city collections
- Get help and personality from Wasabi, our animated Lottie mascot

## 2. Who It's For

**Primary:** People aged 18–40 in NYC and North Jersey who regularly enjoy AYCE sushi with friends, family, or a partner. The goal: any user can confidently choose a restaurant in under one minute.

**Secondary:** Travelers, food enthusiasts, content creators.

**Launch market:** New York City and North Jersey only. Quality before expansion.

## 3. Key Features & Differentiators

### Verified AYCE Only
Every listing is confirmed all-you-can-eat. SushiMap is not a general sushi directory — it is the definitive AYCE sushi guide.

### Wasabi (Animated Mascot)
An animated Lottie character who reacts to user actions during onboarding and throughout the app. He peeks, leans, waves, and celebrates. He never interrupts — he only reacts. Built with Lottie (NOT Rive — Rive now requires a paid plan for exports).

### Sushi Journal
Users log visits as memories, not just reviews. Each entry includes:
- Photos
- Personal notes
- AYCE-specific ratings: Fish Quality, Refill Speed, Value

### Passport
Users collect stamps for each restaurant visited. Stamps unlock neighborhood collections (e.g., "Manhattan Explorer") and city-level achievements.

### Auth
- Sign in with Apple (primary)
- Continue as Guest (seamless — guest data migrates on sign-in)

## 4. Design Philosophy

Premium, minimal, fast — closer to Airbnb and Spotify than Yelp.

- Every screen must handle loading, error, and empty states
- Every interaction must feel intentional
- No clutter, no dark patterns, no ads

## 5. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React Native + Expo (SDK 52+) | Best DX for cross-platform mobile |
| Language | TypeScript (strict) | Type safety, refactoring confidence |
| Routing | Expo Router (file-based) | Native navigation, deep link support |
| Styling | NativeWind (Tailwind for RN) | Rapid, consistent styling |
| Server state | TanStack Query | Caching, background refresh, loading/error states |
| Client state | Zustand | Lightweight, no boilerplate |
| Animations | Reanimated + Lottie | 60fps gestures; Lottie for Wasabi |
| Data | Local JSON + repository pattern | Zero UI changes when swapping to Supabase |

## 6. Data Strategy

All data starts as local JSON files. A repository abstraction layer sits between the UI and data source, so swapping to Supabase (or any backend) later requires **zero UI changes** — only the repository implementation changes.

## 7. Cost Constraint

**Everything must be free to build.** No paid services, no paid APIs, no paid tools during development. EAS Build free tier is acceptable for CI; local Expo Go and dev client builds are preferred for daily development.

## 8. Build Rules (non-negotiable)

- Never use Rive (paid export plan required) — use Lottie only
- Never use EAS Build when a local build works — free tier has limits
- Never add a dependency without documenting what it does and why
- Never ship a screen without loading, error, and empty states
- Never use any paid API or service
- Always update `BUILD_LOG.md` after completing a milestone
- Always ask before any step that requires account creation or config file changes
