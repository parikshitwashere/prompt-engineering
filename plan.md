# JIET Community — implementation plan

## Product and implementation

Create a responsive, client-side React application for students at JIET Jodhpur using JavaScript JSX and Vite. Use React Router for the requested routes, Tailwind CSS for responsive styling and design tokens, Framer Motion for restrained transitions, Lucide React for iconography, React Context/hooks for shared app state, and localStorage as the prototype persistence layer. Keep the project frontend-only: no managed database, server, external authentication, paid APIs, or real email/push/verification claims. Label the demo mode and treat any demo identity as a convenience, not as authentication or a security boundary.

The landing page will offer profile onboarding and a demo-app entry point. Onboarding collects and validates name, college email, branch, academic year, bio and multiple interests, offers an initials/avatar fallback and explains that email verification is not performed. A demo identity will make the seeded app immediately explorable. Persist the selected current student, profiles, activities, posts and local interactions without overwriting existing data on refresh; seed sample data only for a new store and recover gracefully from malformed localStorage.

Implement routes `/`, `/home`, `/explore`, `/publish`, `/dashboard`, `/profile`, `/activities/:id`, plus a friendly 404. Home combines personalized greetings and quick actions with featured, fresh, recommended and upcoming activities, community updates and a spotlight. Explore supports text search, combinable category/branch/year/skill/date/location/capacity filters, sorting, grid/list mode, visible filter state and mobile-friendly filter controls. Activity details show the full record and participants; shared join/leave logic enforces open status, capacity and duplicate prevention, with organizer-only validated edit/cancel actions and preserved history. Publish provides activity and community-post modes, inline validation, an activity preview, success confirmation and detail link; posts support author editing/deletion and basic likes/comments. Dashboard metrics and sections derive from the same canonical activity/post records and keep organized, joined, completed and registered-vs-attended concepts distinct. Profile editing updates the shared student record; email stays private by default.

Use a single local data layer and shared utilities for IDs, dates, activity status, eligibility, capacity and derived counts. Seed at least 12 interconnected activities, 8 sample students and 6 community posts, with consistent IDs, plausible relative dates, varied branches/years/categories/states and at least one full activity. Use the activity concepts and names from the prompt: Sunday Football at the Campus Ground; Build a Campus Lost-and-Found App; DSA Beginner Study Circle; Hackathon Team Formation; Weekend Badminton Doubles; AI and Machine Learning Discussion Group; Inter-Branch Cricket Match; UI/UX Design Jam; Morning Running Group; Open-Source Contribution Circle; Campus Photography Walk; Engineering Mathematics Revision. Include realistic descriptions, categories, caps and tags as specified in the prompt. Never represent sample content as verified or as actual JIET event/attendance data.

## Design direction

**Design Movement:** restrained, cinematic editorial product design for a campus community—premium spacing and typography, but warmer and more social than a corporate dashboard.

**Core Principles:** welcoming at first glance; clear hierarchy and generous whitespace; activity states and actions are immediately legible; responsive, accessible interaction takes priority over decoration.

**Color Philosophy:** use the specified violet `#5B5CE2` as the recognizable anchor, soft violet `#A5A6F6` for secondary emphasis, cool near-white `#F7F8FC` and white surfaces for openness, charcoal `#171923` for readable contrast, muted gray `#6B7280` for supporting text, and restrained success/warning/danger colors for state. Reserve a subtle violet-blue gradient for the primary publish action and selected states. Optional dark mode uses the specified `#101116` / `#191B23` / `#F5F5F7` palette.

**Layout Paradigm:** a spacious editorial welcome surface leads into a persistent community workspace: a calm desktop top bar, clear page introductions, then responsive activity and community modules; on mobile the shell becomes a compact, touch-friendly navigation and single-column flow.

**Signature Elements:** a custom JC connection monogram; small category/state chips paired with participant-avatar clusters; a restrained violet action rail/gradient accent that makes the next step easy to find.

**Interaction Philosophy:** each control produces a visible, immediate result; joins and publish actions update all related views from shared state; keyboard access, clear disabled states and understandable feedback are part of the design, not afterthoughts.

**Animation:** use Framer Motion for a brief staggered landing entrance, subtle route fade/vertical movement, modest card hover lift, restrained list changes and modal transitions. Use transform/opacity where practical, respect `prefers-reduced-motion`, avoid perpetual movement, and never delay an action.

**Typography System:** Inter (with a system sans-serif fallback); strong display scale for page headlines, readable medium-weight section titles, compact uppercase eyebrow labels, and comfortably spaced body text. Keep hierarchy consistent across cards, forms and navigation.

**Brand Essence:** the shared space where JIET students turn common interests into real campus experiences; welcoming, collaborative, energetic.

**Brand Voice:** direct, encouraging and specific. Examples: “Your next great college experience starts here.” “Find your people. Build something together.”

**Wordmark & Logo:** an original geometric JC monogram whose linked letter forms suggest people meeting and building together, paired with the JIET Community wordmark. Use a small inline vector/CSS mark so the logo remains crisp at all sizes.

**Signature Brand Color:** `#5B5CE2`, a confident violet that reads as creative and trustworthy while making collaborative actions easy to recognize.

The landing-page visual collage will be assembled from original interface components (activity previews, initials avatars and category labels), not generic stock imagery or claims about the real campus. Use accessible semantic forms, visible focus rings, labelled icon buttons, keyboard-operable dialogs, screen-reader-friendly validation/status feedback, adequate contrast and roughly 44px touch targets. Adapt the layout around 360, 768, 1024 and 1440px widths without horizontal overflow.

## Project structure and delivery

- `src/main.jsx`, `src/App.jsx`: bootstrapping, route table and application shell.
- `src/layouts/`: desktop/mobile navigation and shared page layout.
- `src/pages/`: landing/onboarding, home, explore, publish, dashboard, profile, activity detail and not-found screens.
- `src/components/`: reusable activity/post cards, participant/avatar groups, forms, filters, dialogs, empty states, badges, buttons and feedback UI.
- `src/context/` and `src/hooks/`: current student, shared community state and local interaction hooks.
- `src/data/`: seeded students, activities and posts.
- `src/services/`: validated localStorage repository and state operations.
- `src/utils/`: ID, date, status, eligibility, search and derived-metric helpers.
- `src/styles/`: Tailwind entry point, global styles and theme tokens.
- `public/manus-routes.json`: static route manifest kept in sync with the route table.
- Root: Vite/Tailwind/PostCSS configuration, pinned package-manager metadata and README with setup/run steps, implemented features, structure and demo limitations.

Keep initial validation behavior in shared functions as well as forms; render user text safely as text, never evaluate it or inject HTML. Use a pinned Node package manager and checked-in lifecycle-script policy before installation. Configure JavaScript diagnostics before the first app-code batch. Run the project build and confirm the route manifest is served as JSON after the preview server starts. The app will be prepared for preview in the initialized project; publication is a separate action and is not included in this plan.