# Notematica Mobile (iOS/Android Wrapper)

This folder contains a Capacitor native wrapper that loads the live site:

- https://notematica.com

## Prereqs (your Mac)

- Node 18+
- Xcode (for iOS)
- Android Studio (for Android)

## Install

```bash
cd "mobile"
npm install
```

## Create Native Projects

```bash
npm run cap:add:ios
npm run cap:add:android
```

## Open In IDE

```bash
npm run cap:open:ios
npm run cap:open:android
```

## Notes

- The web app detects the native wrapper and disables AdSense (and we should also disable Stripe purchase buttons inside the store apps to avoid review issues).
- For store submission, you still need Apple Developer + Google Play developer accounts and store listing assets (screenshots, description, privacy policy URL).

