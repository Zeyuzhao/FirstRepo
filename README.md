# FirstRepo

This is a Next.js application.

## Getting Started

Install dependencies from the lockfile:

```bash
npm ci
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Project Structure

- `app/page.tsx` contains the home page.
- `app/layout.tsx` contains the root document shell and metadata.
- `app/globals.css` contains the global styles.

## Setup Status

The project has been verified with `npm install` and `npm run build`.

`npm audit --audit-level=moderate` currently reports a moderate advisory in Next.js'
PostCSS dependency path. The available npm fix is a breaking downgrade, so it was not
applied during setup.
