# Reportr

A reporting application with Google sign-in, a report feed, report detail/status pages, attachment uploads, and report interactions such as support, reup, flag, and track.

Built with React 19, Vite, Firebase Authentication/Firestore, Cloudinary uploads, TanStack Query, Zustand, Tailwind CSS, and Radix UI.

## Local development

```sh
git clone https://github.com/Zoiku/reportr.git
cd reportr
npm install
```

Create `.env.local` with your Firebase browser configuration:

```dotenv
VITE_FIREBASE_CONFIG_API_KEY=
VITE_FIREBASE_CONFIG_AUTH_DOMAIN=
VITE_FIREBASE_CONFIG_PROJECT_ID=
VITE_FIREBASE_CONFIG_STORAGE_BUCKET=
VITE_FIREBASE_CONFIG_MESSAGING_SENDER_ID=
VITE_FIREBASE_CONFIG_APP_ID=
VITE_FIREBASE_CONFIG_MEASUREMENT_ID=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_CLOUD_PRESET_NAME=
VITE_REPORT_INPUT_MIN_LENGTH=10
VITE_REPORT_INPUT_MAX_LENGTH=2000
```

The input limits above are example project settings; choose the limits appropriate to your deployment. Firebase values are read in `src/configs/firebase.js`. Enable Google sign-in, authorize the local domain, and configure Firestore rules for your intended access model.

Attachments use `src/services/upload.js` and require a Cloudinary upload preset suitable for browser uploads. The frontend has no private Cloudinary signing endpoint; do not put a private API secret in Vite variables.

```sh
npm run dev
```

Open Vite's printed URL. Node.js and npm are required.

## Commands

- `npm run build`: production assets in `dist/`.
- `npm run preview`: serves the production build locally.
- `npm run lint`: ESLint.

No test script is declared.

## Code guide

- `src/routes/`: sign-in, protected pages, and system routes.
- `src/forms/quick-create-report.jsx`: report creation and input limits.
- `src/services/report.js`: Firestore `reports` queries and creation.
- `src/services/interactions.js`: interaction collections.
- `src/services/upload.js`: Cloudinary attachment uploads.
- `src/hooks/use-auth-store.js`: Google sign-in/session state.

The `flagReport` export in `report.js` is a stub; interaction functions are implemented separately in `interactions.js`. Do not assume every interface action has a completed backend workflow.

## Deployment and checks

Set public configuration before building and host `dist/` with fallback to `index.html` for protected browser routes. Verify sign-in, report creation, attachment handling, detail navigation, and access rules using a development Firebase project.
