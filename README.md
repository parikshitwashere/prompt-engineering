# JIET Community

A responsive React prototype where JIET Jodhpur students can find teammates, discover activities, share updates and keep a local record of their campus participation.

## Run locally

Requirements: Node.js 20.19+ and npm 10.9.2 (or a compatible npm 10 release).

```bash
npm install
npm run dev
```

Vite serves the preview on port 3000. Create a production bundle with `npm run build`.

## Project structure

- `src/pages/` contains landing/onboarding, Home, Explore, Publish, Dashboard, Profile, activity detail and not-found screens.
- `src/components/` contains reusable navigation, cards, forms, avatars, filters, dialogs and feedback.
- `src/context/` shares the current demo student and community actions.
- `src/data/mock.js` supplies the interconnected sample dataset; `src/services/storage.js` seeds and persists it.
- `src/utils/` contains date, capacity, category and derived-metric helpers; `src/styles.css` holds global design tokens and responsive styles.
- `public/manus-routes.json` declares the client-visible page routes.

## Implemented prototype behavior

Profile onboarding/editing, demo entry, activity discovery/search/filters, activity details, capacity-aware join/leave, organizer edit/cancel, activity creation, community posts with local likes/comments, dashboard history and local persistence are implemented entirely in the browser. Sample students, activities and posts are interconnected and marked as demo content.

## Demo limitations

This prototype has no real login, email verification, backend, shared database, moderation team, email/push delivery or verified attendance. Browser localStorage is not secure account storage and must not be used for sensitive information or production authorization. Unrecognized saved demo data is copied to `jiet-community-v1-recovery` in localStorage before sample data is loaded. Production use should replace it with secure authentication and server-enforced eligibility, permissions, capacity, moderation, privacy and retention controls.
