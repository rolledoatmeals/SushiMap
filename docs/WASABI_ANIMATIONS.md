# Wasabi — Animation Guide

Wasabi is SushiMap's animated mascot. He is a small sushi chef character rendered via Lottie (`lottie-react-native`). He **never interrupts** — he only **reacts** to things the user does.

---

## Core Principles

1. **Reactive, not proactive.** Wasabi responds to user actions. He does not initiate.
2. **Never block content.** Wasabi appears in designated zones (onboarding, empty states, celebration moments). He never floats over interactive UI.
3. **Subtle by default.** His idle loop is calm. Energy scales with the importance of the moment.
4. **One animation at a time.** Never interrupt a playing animation with another. Queue or ignore new triggers until the current one finishes.

---

## Animation Library

All Lottie JSON files live in `assets/lottie/wasabi/`.

| File | Trigger | Duration | Notes |
|---|---|---|---|
| `idle.json` | Default / loop | ∞ loop | Gentle breathing, slow blink |
| `wave.json` | First app open | ~1.5s | One friendly wave, then return to idle |
| `peek.json` | Loading state | loops until done | Wasabi peeks from behind something |
| `celebrate.json` | Stamp earned, journal saved | ~2s | Jumps, confetti, returns to idle |
| `think.json` | No results / empty state | loops | Taps chin, looks around |
| `sad.json` | Error state | ~1s, then idle | Droops, recovers |
| `point.json` | Onboarding tooltip | ~1s per step | Points at relevant UI element |
| `eat.json` | After restaurant visited | ~2s | Takes a big bite, thumbs up |
| `write.json` | Journal create — step 5 (Notes) | loops | Scribbles, tilts head, pen moves |
| `point.json` | Onboarding location step | loops | Points upward, gentle bounce |

---

## Onboarding Sequence

Wasabi guides users through onboarding with `point.json` and speech bubbles. He never advances the step — the user does. Each step:

1. User arrives at step → Wasabi plays `wave.json` once
2. User reads / interacts → Wasabi loops `idle.json`
3. User completes step → Wasabi plays `celebrate.json` once
4. Advance to next step → repeat

---

## Implementation Notes

- Use `lottie-react-native` `<LottieView>` component
- Set `autoPlay={false}` and control playback with `ref.current.play()` / `ref.current.reset()`
- Always set `loop={false}` for one-shot animations; `loop={true}` only for idle/peek/think
- Use `onAnimationFinish` callback to return to idle after one-shot plays
- Wrap in `React.memo` — Lottie re-renders are expensive

---

## Free Animation Sources

All Lottie files must be free. Approved sources:
- [LottieFiles.com](https://lottiefiles.com) — free tier, search "sushi", "chef", "character"
- Design custom in Adobe After Effects → export via Bodymovin plugin (free)
- Hand-craft JSON for simple shapes (no external dependency)

**Never use Rive** — their export tool now requires a paid plan.

---

## Journal Appearance

| Screen | Wasabi mood | Trigger |
|---|---|---|
| Journal tab (empty state) | `think` | No entries yet |
| Create — Step 1 (Restaurant) | `idle` | Default |
| Create — Step 2 (Date) | `think` | Appears to ponder |
| Create — Step 3 (Photos) | `wave` | Welcoming |
| Create — Step 4 (Ratings) | `eat` | Eats enthusiastically while user rates |
| Create — Step 5 (Notes) | `write` | Scribbles along |

Wasabi is **not** shown on the journal entry detail screen (content-only view).

---

## Download Links (Free Replacements)

Placeholder files live in `assets/animations/`. Each filename maps directly to a `WasabiMood`. To replace one: download the Lottie `.json` from LottieFiles (free tier — 10 downloads/month, all under Lottie Simple License, commercial use OK, no attribution required), rename it, drop it in — **no code changes needed**.

| Mood | File | LottieFiles URL |
|---|---|---|
| idle | `wasabi-idle.json` | lottiefiles.com/free-animation/character-idle-animation-CkqpqouAy7 |
| wave | `wasabi-wave.json` | lottiefiles.com/free-animation/waving-hand-7HOaaXpaGU |
| peek | `wasabi-peek.json` | lottiefiles.com/free-animation/looking-around-77Jr11nVPc |
| celebrate | `wasabi-celebrate.json` | lottiefiles.com/free-animation/confetti-celebration-LXxcaxmSdk |
| think | `wasabi-think.json` | lottiefiles.com/free-animation/thinking-animation-Yk3N6N7yPK |
| sad | `wasabi-sad.json` | lottiefiles.com/43003-sad-face |
| eat | `wasabi-eat.json` | lottiefiles.com/free-animation/man-eating-burger-TxvOsw9y7p |
| write | `wasabi-write.json` | lottiefiles.com/free-animation/line-drawing-of-pencil-writing-wjZrj3i7rU |
| point | `wasabi-point.json` | lottiefiles.com/free-animation/pointing-finger-animation-UjtVknxhdo |

> Verify the license badge says "Free" (not "Pro" or "Marketplace") before downloading.
