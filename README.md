# LPU Touch — High-Fidelity Prototype (Unofficial Demo)

This is a **standalone local prototype** inspired by the LPU Touch mobile interface. It is
**not** the official LPU Touch app and does **not** connect to any real LPU backend,
authentication, attendance, or mess system. Everything runs entirely in your browser with
mock data and `localStorage`.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`). The app is optimized
for mobile widths (~360-412px) and is shown as a centered mobile frame on desktop.

## Demo flow

```
Dashboard -> Sidebar -> Edit Profile -> change photo/name/room/etc -> Save
Dashboard -> Mess Food Scanner tile (or Sidebar -> Mess Food Scanner)
  -> Mess Coupon -> tap Breakfast / Lunch / Dinner
  -> camera opens -> scan ANY QR code
  -> Mess Pass appears IMMEDIATELY (no waiting/loading screen)
  -> stays active for 30 seconds (small countdown badge, top-right of the pass)
  -> auto-closes back to Mess Coupon when the countdown reaches 0
```

The QR scanner will request camera permission. Any successfully decoded QR code
(the content itself is not checked or transmitted anywhere) advances the demo -- this is a
local UI demonstration, not a real mess-attendance system.

## Testing checklist

1. `Dashboard` -> `Mess Food Scanner` tile -> `Mess Coupon` opens with your current profile.
2. Tap `Dinner` -> browser asks for camera permission -> allow it -> point at any QR code
   (a QR code generated from any text works, including the one on the Mess Pass result
   screen itself, which encodes `LPU-MESS-DEMO-<registration number>`).
3. On successful detection: camera stops -> `Mess Pass` appears **immediately** as a bottom
   sheet showing your photo + a generated QR code side-by-side, registration/name, meal/mess,
   program, assigned mess, current date/time, green "Meal Approved", RATE US, the framed
   looping green ACCEPTED animation, then Father's/Mother's Name, Session, Hostel, and a
   Verification Code.
   - In `npm run dev` (development mode only -- this button does not exist in a production
     build, confirmed by grepping the built bundle), a small **"Test Scan (dev only)"**
     button appears under the scan frame so you can exercise the rest of the flow without a
     second device on hand. It's a manual trigger for testing, not a substitute for actually
     scanning a real QR code.
4. Watch the small gray badge at the top-right of the pass -- it starts at 30 and counts
   down once per second. When it hits 0 the pass closes itself back to Mess Coupon.
5. Go back and repeat with `Breakfast`, then `Lunch` -- the result screen must show the
   correct meal each time.
6. `Sidebar` -> `Edit Profile` -> change photo, registration number, and room -> `Save
   Changes` -> repeat the scan flow -- the Mess Coupon and Mess Pass result must both show
   the updated photo/number/room.
7. Refresh the page after saving -- the edited profile must persist (localStorage).
8. Deny camera permission once (browser prompt) to confirm the "Camera access was denied"
   screen appears instead of a crash, then reload and allow it to confirm the scanner
   recovers.

## QR detection — actually verified this time

Two real bugs were found and fixed, and both were confirmed with an actual automated
end-to-end test (headless Chromium launched with `--use-fake-device-for-media-stream` and
`--use-file-for-fake-video-capture` pointed at a generated video of a real QR code -- not a
code-only review):

1. **The scanner's CSS forced `object-fit: cover !important` on the video element.**
   `html5-qrcode` doesn't set `object-fit` itself (confirmed in its source) and calculates its
   scanning region using `videoWidth / clientWidth` ratios, which is only correct if the video
   isn't being cropped by CSS. The `cover` override cropped the visible picture, so the pixels
   being decoded no longer matched what was on screen. **Fixed** by removing that CSS rule
   entirely and letting the library manage its own video sizing.
2. **`aspectRatio: 1.0` was being forced in the scan config.** Requesting a square stream from
   a camera whose native resolution isn't square (most webcams are 4:3 or 16:9) makes the
   browser crop the feed to satisfy that constraint, which was cutting into the frame content.
   **Fixed** by dropping that constraint -- `qrbox: 250x250` still controls the on-screen
   scan-frame overlay, it just no longer forces the underlying camera stream into an unnatural
   shape.

With both fixes applied, the automated test detects a QR code and lands on `/mess/result`
in about 1 second, consistently, across repeated runs. It was also re-run after the layout
changes below to confirm nothing regressed.

Camera acquisition tries the standard `facingMode: environment` constraint first and only
falls back to enumerating devices if that specific attempt fails (rather than always
enumerating first, which forces an extra grab-then-release of the camera). A synchronous
guard (`hasScannedRef`) prevents a possible double-fire of the success handler if two decode
callbacks land in the same frame.

**What this confirms:** a real, decodable QR code placed in front of a camera gets detected
and opens the Mess Pass. **What it doesn't confirm:** behavior on a specific physical
phone/browser/lighting condition, since this sandbox has no real camera -- if you hit an
edge case on your actual device, it's most likely a camera-specific constraint issue, not the
two bugs above (those are now verified fixed).

A **"Test Scan (dev only)"** button remains under the scan frame in dev builds (`npm run dev`)
for exercising the result screen without a physical QR on hand. It does not replace or bypass
real detection -- it's gated by `import.meta.env.DEV` (absent from `npm run build`) and calls
the identical success path a real decode would. Delete the `handleTestScan` block in
`MessScanner.tsx` (and its button in the JSX) if you'd rather not have it at all.

## Mess Pass layout -- re-checked against the recording

After the QR fix, the result screen's proportions were re-measured directly against the
recording (not just the code): the photo and QR were noticeably smaller than the reference
(~28% of screen width vs. the reference's ~36%) and were enlarged to match (108px -> 136px).
The vertical spacing between the program line, assigned-mess line, date/time row, and "Meal
Approved" was tighter than the recording's more generous rhythm and has been increased to
match. Confirmed by rendering the actual page and comparing screenshots against extracted
video frames, not by inspecting CSS values in isolation.

The looping green ACCEPTED animation, countdown badge (confirmed via a live 5-second
real-time check that it decrements exactly 1/second: 30 -> 25), and profile-data propagation
(confirmed via an automated Edit Profile -> Save -> re-scan test showing updated name,
registration number, and hostel/room on the result) were all re-verified working after these
layout changes, not just left assumed-correct from before.

## Centralized profile

All student information (name, photo, registration number, hostel, room, mess, program,
batch, etc.) lives in one React Context (`src/context/ProfileContext.tsx`) and is persisted
to `localStorage`. Every screen -- Sidebar, Profile, Mess Coupon, and the Mess Pass result --
reads from this single source of truth, so editing it once updates it everywhere.

Use **Sidebar -> Edit Profile -> Reset to Default** to restore the original demo profile
(Ashok Mittal).

Profile data is stored in `localStorage` under a versioned key. If your browser has data
saved from an older build of this project, it is discarded on load rather than reused --
you'll see the current safe default profile instead. This matters if you previously ran an
earlier version of this project that used real personal information as its placeholder
default; that old entry will not resurface.

## Precision pass -- centering, RATE US, lower details, border color

All of the following were verified by actually rendering the app in a headless browser with
a simulated camera feeding it a real QR code (not by reading the CSS and assuming it was
right):

- **ACCEPTED animation centering.** Was bottom-aligned (`align-items: flex-end` +
  `padding-bottom: 22px`); changed to `align-items: center; justify-content: center` with the
  padding removed. Measured the actual bounding boxes of the white inner box vs. the
  checkmark+text group at two different points in the animation loop (including a moment
  where the text is scaling) -- center offset was **0.0px** in both X and Y both times, so it
  doesn't drift as the group's visual width changes during the loop.
- **RATE US.** Re-sampled pixel colors directly from your recording: the button text is
  black (`~rgb(20,20,20)`), not maroon -- the previous version colored the text the same
  maroon as the border, which was wrong. Fixed to black text, brighter gold star, slightly
  more padding to match the reference's proportions. Confirmed via computed style
  (`rgb(26, 26, 26)`) on the live page, not just the CSS source.
- **Lower details.** Father's/Mother's Name rows now show the phone number inline --
  `Ashok Mittal (1234567890)` -- matching the recording's format, sourced from
  `fatherPhone`/`motherPhone` on the centralized profile. The Hostel row now shows the full
  hostel string (previously it showed only the extracted room code).
- **Accepted Box Border Color.** New setting in Edit Profile, under a dedicated
  "Appearance" group: a native color picker labeled "Accepted Box Border Color". It's stored
  as `acceptedBorderColor` on the same centralized `StudentProfile`/`ProfileContext` used
  everywhere else (default `#957e66`, matching the recording), and applies to the Mess
  Pass's frame the moment you pick a color -- no "Save" click needed, since it's purely
  cosmetic. Verified live: setting it to `#2255aa` changed only the frame's background
  (confirmed via computed style), while the white inner box, the RATE US border, and the
  green animation were all confirmed unchanged.

All of the above was checked with the same real-QR-code headless test used earlier -- the
scanner still detects and lands on `/mess/result` in ~1 second after these changes, so
nothing about the scanning flow was affected by this pass.

## Camera / secure context requirement

Browsers only allow camera access (`getUserMedia`) in a **secure context**: `https://` or
`http://localhost`. Running `npm run dev` and opening the printed `http://localhost:...` URL
satisfies this. If you deploy this elsewhere, it must be served over HTTPS or the scanner
will report "Camera unavailable" / a permission error by design (not a bug).

## Notes on scope

- The default profile is fully generic demo data — no real personal information (name,
  contact details, address, or photo) is included. The profile photo defaults to a neutral
  placeholder avatar (`src/assets/default-avatar.svg`) until the user uploads their own via
  Edit Profile.
- The academic/hostel/mess fields (program, batch, section, hostel, allocated mess, etc.)
  were taken from the supplied reference screenshots, as instructed.
- Colors and gradients were sampled directly from the supplied screenshots.
- Typography now uses Roboto (self-hosted via `@fontsource/roboto`, actually bundled — not
  just referenced in CSS), matching the Android-native look in the reference screenshots.
- **The Mess Pass result screen was rebuilt from an actual screen recording** you provided
  (frame-by-frame analysis: header/drag-handle, photo+QR side-by-side, countdown badge
  behavior, the brown-framed ACCEPTED area, and its looping green checkmark→pill→text
  animation were all measured from real video frames, not guessed). The one piece the
  recording didn't show is the lower Father's/Mother's Name, Session, Hostel, and
  Verification Code section — that part follows the written spec you gave, styled to match
  the rest of the pass.
- The QR code on the Mess Pass is generated locally (`qrcode.react`) from non-sensitive demo
  values (registration number, meal, timestamp) — it is not a real LPU credential and encodes
  nothing sent anywhere.
- Most sidebar menu items are intentionally non-functional demo placeholders per the brief,
  and show a short toast/alert instead of a fake screen.

