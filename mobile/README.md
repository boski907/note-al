# Notematica Mobile (iOS/Android Wrapper)

This folder contains a Capacitor native wrapper that bundles the web app and calls the live API at:

- https://notematica.com (API base)

## Prereqs (your Mac)

- Node 18+
- Xcode (for iOS)
- Android Studio (for Android)

## Install

```bash
cd "mobile"
npm install
```

## Sync Web Assets Into www/

This copies `../public/*` into `mobile/www/` and injects the API base + Capacitor bridge.

```bash
npm run www:sync
```

## Create Native Projects

```bash
npm run cap:add:ios
npm run cap:add:android
```

## Sync Into Native Projects

```bash
npm run cap:sync
```

## Open In IDE

```bash
npm run cap:open:ios
npm run cap:open:android
```

## Notes

- The web app detects the native wrapper and disables AdSense + hides Stripe purchase/portal buttons (store-safe). Users can still be Premium if they subscribed on the web.
- For store submission, you still need Apple Developer + Google Play developer accounts and store listing assets (screenshots, description, privacy policy URL).
- Android builds require a JDK (recommend JDK 17) and Android Studio SDK setup.
