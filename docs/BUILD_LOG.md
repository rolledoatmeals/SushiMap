# SushiMap — Build Log

---

## Milestone 0 — Project Scaffold
**Date:** 2026-06-27
**Status:** ✅ Complete

### What was done
- Initialized Expo SDK 56 project with TypeScript template
- Installed and configured all core dependencies:
  - Navigation: `expo-router`, `react-native-safe-area-context`, `react-native-screens`
  - Styling: `nativewind@4`, `tailwindcss@3`
  - State: `@tanstack/react-query`, `zustand`
  - Animations: `react-native-reanimated`, `react-native-gesture-handler`
  - UI: `@gorhom/bottom-sheet`
  - Expo modules: `expo-image`, `expo-blur`, `expo-haptics`, `expo-secure-store`, `expo-apple-authentication`, `expo-location`, `expo-image-picker`
  - Wasabi: `lottie-react-native`
- Set up strict TypeScript config with path aliases (`@components`, `@services`, `@repositories`, `@stores`, `@hooks`, `@types`, `@assets`, `@constants`, `@data`)
- Configured NativeWind v4 (tailwind.config.js, babel.config.js, metro.config.js, global.css)
- Set up ESLint + Prettier with React Native rules
- Configured app.json: scheme, bundle IDs, typed routes, all permission strings
- Created full folder structure
- Installed `claude-essential-plugin` globally via Claude Code CLI

### Tech decisions
- `tailwindcss@3` (not v4) — required by nativewind@4
- `legacy-peer-deps=true` in `.npmrc` — harmless React peer version mismatch in Expo's dependency tree
- `index.ts` points to `expo-router/entry` — Expo Router owns the root

### Deferred
- None

---

---

## Milestone 1 — Core Types & Repository Layer
**Date:** 2026-06-27
**Status:** ✅ Complete

### What was done
- Defined strict TypeScript types: `Restaurant`, `JournalEntry`, `PassportStamp`, `Collection`, all supporting subtypes
- Built `RestaurantRepository` interface — the swap boundary between local JSON and Supabase
- Implemented `JsonRestaurantRepository` — reads from `data/restaurants.json`, no network calls
- Implemented `RestaurantService` — search, filter, sort (by rating, distance, price), haversine distance
- Seeded 10 real NYC/NJ AYCE restaurants across 8 neighborhoods
- Added `Colors` constants with brand palette

### Seed restaurants (10)
NYC: Upper East Side, Upper West Side, Koreatown, West Village, Flushing, Hell's Kitchen, East Village
NJ: Fort Lee, Edgewater, Hewlett

### Architecture note
Repository pattern means zero UI changes when swapping to Supabase — only `JsonRestaurantRepository` gets replaced with `SupabaseRestaurantRepository`.

---

---

## Milestone 2 — App Shell & Navigation
**Date:** 2026-06-27
**Status:** ✅ Complete

### What was done
- Root `app/_layout.tsx`: QueryClientProvider (5min stale), GestureHandlerRootView, SafeAreaProvider, StatusBar, Stack with typed screen options
- Tab navigator `app/(tabs)/_layout.tsx`: Explore, Map, Journal, Passport with Ionicons, brand red active tint, platform-aware tab bar height
- All 4 tab screens with full loading/error/empty states + Wasabi character
- Restaurant detail screen (`app/restaurant/[id].tsx`) — queries by ID, photo placeholder, tags, "Log a Visit" CTA
- Journal new entry screen (`app/journal/new.tsx`) — 4 AYCE ratings, notes, would-return, haptics on every interaction
- Journal entry detail screen (`app/journal/[id].tsx`)
- Auth layout + Welcome screen with Apple Sign In stub and guest flow
- `WasabiCharacter` component — 7 moods (idle, wave, celebrate, think, sad, peek, eat) animated with Reanimated; emoji placeholder until real Lottie files added
- `journalStore` (Zustand) — add/update/delete entries, query by restaurant
- `passportStore` (Zustand) — stamps, 4 collections with progress tracking, auto-unlock logic
- `nativewind-env.d.ts` — TypeScript className support

### Architecture decisions
- Service instances created at module level per screen — simple now, easy to move to context/DI if needed
- Haptics on every rating tap and save action — feels premium without code cost
- WasabiCharacter accepts a `mood` prop and drives all animation from a single `useEffect` — zero state, predictable

---

---

## Milestone 7 — Sushi Journal Feature
**Date:** 2026-06-28
**Status:** ✅ Complete

### What was done
- Rewrote `stores/journalStore.ts` — full SecureStore persistence, `hydrate()` wired in root `_layout.tsx`
- Added `hydrate()` calls for journalStore + savedStore in root layout (previously only authStore was hydrated)
- Added `write` and `point` moods to `WasabiCharacter` (Reanimated animations: write = tilting rotation loop, point = bounce loop)
- Built `app/(tabs)/journal.tsx` — FlatList of `JournalEntryCard` components, entry count badge, FAB (salmon circle + icon), empty state with Wasabi `think`
- Built `app/journal/create.tsx` — 5-step flow (Restaurant → Date → Photos → Ratings → Notes):
  - Step 1: searchable restaurant list, radio-style selection
  - Step 2: Today/Yesterday quick-pick + manual YYYY-MM-DD TextInput, local timezone safe
  - Step 3: `expo-image-picker` with permission request, multi-select up to 6, thumbnail strip with remove
  - Step 4: 5-category star ratings (fish quality required, others optional), Would Return toggle
  - Step 5: multiline notes TextInput + visit summary card
  - Progress bar, Wasabi reacts per step, haptics on every action
  - On save: `router.replace` to new entry detail
- Built `app/journal/[id].tsx` — full entry detail:
  - Horizontal photo carousel with pagination dots
  - Would Return chip + restaurant neighborhood quick-link
  - Ratings card with progress bars
  - Notes card (hidden when empty)
  - Share via `Share.share()`, delete with Alert confirmation + haptic Warning

### Architecture
- `JournalEntry.date` (ISO string, local timezone) replaces old `visitedAt`
- `JournalRatings.fishQuality` is required; all other fields optional
- SecureStore key: `journal_entries` (JSON array)
- `restaurantService` (singleton) used via `useRestaurants()` hook — no direct data access in screens

---

---

## Milestone 8 — Passport Feature
**Date:** 2026-06-28
**Status:** ✅ Complete

### What was done
- Replaced `stores/passportStore.ts` with a no-op — passport data is 100% derived from journal entries
- Redirected `app/journal/new.tsx` → `/journal/create` to eliminate TypeScript errors from stale old types
- Built `app/(tabs)/passport.tsx`:
  - **Stamps grid**: 3-column grid of all 12 restaurants (salmon = visited, grey outline = unvisited)
  - `StampItem` component: each has its own `useSharedValue(0)` → `withDelay(delay, withSpring(1))` pop-in animation (index × 55ms stagger)
  - **Collections**: 4 cards (Palisades Park Pack, Fort Lee Explorer, Flushing Obsessed, NYC + NJ Explorer), each with salmon progress bar, green "DONE" badge on completion
  - "NYC + NJ Explorer" uses market-aware logic (any 1 NYC + any 1 NJ restaurant)
  - **Achievements**: 6 badges (First Bite, Double Dip, Five Star Fish, Roll Call, Regular, Completionist) — computed from journal entries, unlocked = green background, locked = grey+faded
  - Wasabi `celebrate` when stamps > 0, `idle` on empty state
  - Empty state with full EmptyState component

### Architecture
- No separate stamp tracking — all derived from `useJournalStore(s => s.entries)` + `useRestaurants()`
- `LocalCollection` type (screen-local) handles custom completion logic per collection
- No cross-store dependencies; works offline from day 1

---

---

## Milestone 9 — Search Screen
**Date:** 2026-06-28
**Status:** ✅ Complete

### What was done
- Created `stores/searchStore.ts` — recent searches (last 8), SecureStore persistent, hydrated on app start
- Built `app/search.tsx`:
  - Auto-focus TextInput via `setTimeout(..., 100)`
  - Debounced 300ms query via `useDebounce` hook
  - Filters `useRestaurants(filters)` results client-side by text (name/neighborhood/city)
  - Recent searches list with per-item removal and "Clear all" button
  - Idle empty state: Wasabi `think` + prompt text
  - No-results empty state: Wasabi `sad` + query echoed
  - Filter bottom sheet (`@gorhom/bottom-sheet`):
    - Max dinner price chips: Any / ≤$30 / ≤$40 / ≤$50 / ≤$60
    - Open Now toggle
    - Sashimi / Nigiri toggles
    - Time limit chips: Any / Quick (≤90 min) / Relaxed (120+ min)
    - Parking / Accessible toggles
    - Apply + Reset All buttons
  - Active filter count badge on filter icon (salmon)
  - Draft/applied filter separation — changes are staged until "Apply Filters"

---

## Milestone 10 — Profile Screen
**Date:** 2026-06-28
**Status:** ✅ Complete

### What was done
- Created `stores/appearanceStore.ts` — `'light' | 'dark' | 'system'` mode, SecureStore persistent
- Updated `hooks/useColors.ts` to read from appearanceStore, overriding system color scheme
- Added `migrateToUser(userId)` to journalStore — updates guest entries' userId on sign-in
- Built `app/(tabs)/profile.tsx`:
  - **Guest state**: Wasabi `wave`, sign-in pitch card, native Apple Sign In button (HIGS compliant)
  - **Signed-in state**: avatar with initials (salmon circle), name, email
  - **Stats row**: Visits / Spots / Saved — derived from journalStore + savedStore
  - **Appearance**: 3-way segmented toggle (Light / Auto / Dark) — writes to appearanceStore
  - **Data**: Export (Share API JSON dump) + Clear Search History
  - **Account**: Sign Out with Alert confirmation, haptic Warning
  - **About**: version from expo-constants, Rate / Terms / Privacy rows (placeholders)
  - Apple Sign In → `setAppleUser` → `migrateToUser` → haptic success

---

## Next milestone
**Milestone 11 — Quality Audit**
