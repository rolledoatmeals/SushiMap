# App Store Connect — SushiMap Submission Checklist

## Before you submit

### Privacy Policy URL
1. Go to your GitHub repo → **Settings → Pages**
2. Set source to `main` branch, `/docs` folder
3. Your privacy policy will be at:
   `https://[your-github-username].github.io/SushiMap/privacy.html`
4. Paste that URL into App Store Connect → App Information → Privacy Policy URL

---

## App Store listing copy

### Name
`SushiMap`

### Subtitle (30 chars max)
`NYC & NJ All-You-Can-Eat Sushi`

### Description
```
Find every all-you-can-eat sushi spot in NYC, New Jersey, and Tampa Bay — instantly.

SushiMap is the only app built specifically for AYCE sushi lovers. Browse 60+ verified restaurants with real prices, hours, BYOB status, and time limits. No guessing. No outdated info.

DISCOVER
• Filter by price, market, sashimi/nigiri availability, BYOB, and parking
• See which spots are open right now
• Sort by distance, rating, or price

YOUR SUSHI JOURNAL
• Log every AYCE visit with detailed ratings: fish quality, value, service, refill speed, and atmosphere
• Add notes and photos to remember each meal
• Track which spots you'd return to

PASSPORT & STAMPS
• Earn a stamp for every restaurant you visit
• Unlock collection badges (Palisades Park Pack, Flushing Obsessed, Tampa Bay Sushi Tour, and more)
• Climb the community leaderboard

MAP VIEW
• See all restaurants on an interactive map
• Tap any pin for pricing, hours, and your journal history

No ads. No subscriptions. Just sushi.
```

### Keywords (100 chars max, comma-separated)
`sushi,ayce,all you can eat,sushi map,japanese food,buffet,NYC,NJ,New Jersey,restaurant finder`

### What's New (first release)
```
SushiMap is here. Discover, track, and collect all-you-can-eat sushi across NYC, New Jersey, and Tampa Bay.
```

### Support URL
`mailto:zacharyshepelsky20@gmail.com`

### Marketing URL
*(leave blank for now)*

---

## App information

| Field | Value |
|---|---|
| Bundle ID | com.sushimap.app |
| SKU | sushimap-001 |
| Primary language | English (U.S.) |
| Category | Food & Drink |
| Secondary category | Travel |
| Age rating | 4+ |
| Price | Free |

---

## Screenshots needed (iPhone 6.9" — iPhone 16 Pro Max)

Capture these screens in order. Use the simulator or your device.

1. **Home / Discover** — filter chips visible, restaurant cards with price + rating
2. **Restaurant detail** — show price, time limit, tags, community reviews
3. **Map view** — pins clustered, a restaurant card expanded
4. **Passport / Stamps** — stamp grid with a few filled, leaderboard visible
5. **Journal / Log a Visit** — rating sliders filled in, looks like a real review

Required sizes:
- iPhone 6.9" (1320 × 2868 px) — **required**
- iPhone 5.5" (1242 × 2208 px) — optional but widens reach

---

## Build & upload

```bash
# Build for TestFlight / App Store
npx expo run:ios --configuration Release

# Or use EAS Build (recommended for CI):
npx eas build --platform ios --profile production
```

Upload the `.ipa` via Xcode Organizer or `xcrun altool`.
