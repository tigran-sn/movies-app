# Movie Explorer (React + Vite + Tailwind + Appwrite)

Discover and search movies from TMDB with a fast React + Vite frontend. The app features debounced search, an optional adult-content filter, and a "Trending" section backed by Appwrite that ranks the most frequent searches.

## Features

- Fast React 19 + Vite 7 setup with HMR
- Tailwind CSS v4 styling
- Debounced search against TMDB API
- Toggle to include/exclude adult movies
- Movie cards with rating, language, year, backdrop, and overview
- Trending list (top 5) powered by Appwrite, sorted by search frequency

## Tech Stack

- React 19, Vite 7
- Tailwind CSS 4
- Appwrite (Database)
- TMDB API (v3 endpoints, v4 Read Access Token)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- TMDB account with a v4 API "Read Access Token"
- Appwrite project (cloud or self-hosted)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# TMDB: use your v4 Read Access Token (bearer token)
VITE_TMDB_API_KEY=YOUR_TMDB_V4_READ_ACCESS_TOKEN

# Appwrite project + database
VITE_APPWRITE_PROJECT_ID=YOUR_APPWRITE_PROJECT_ID
VITE_APPWRITE_DATABASE_ID=YOUR_APPWRITE_DATABASE_ID
VITE_APPWRITE_COLLECTION_ID=YOUR_APPWRITE_COLLECTION_ID
```

Notes:
- `VITE_TMDB_API_KEY` should be the TMDB v4 "Read Access Token" used as a Bearer token.
- Do not commit your `.env` file to version control.

### Appwrite Setup

1. Create a project in Appwrite Cloud (or self-host) and note the `Project ID`.
2. Create a Database and a Collection for tracking trending searches.
3. Add the following attributes (example types; adjust to your needs):
   - `searchTerm` (string, required, indexed)
   - `title` (string, optional)
   - `movie_id` (string, optional)
   - `poster_url` (string, optional)
   - `count` (integer, required, indexed, default 1)
4. Set permissions for a quick demo:
   - Read: Any
   - Create/Update: Any
   Caution: This is not recommended for production. For production, implement proper auth or server-side functions.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview (after build)

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## How It Works

- Search requests are debounced by 500ms to reduce API calls.
- When a search returns results, the app increments a counter in Appwrite for that `searchTerm` and stores basic movie metadata (first matching movie).
- The Trending section queries Appwrite for the top 5 documents ordered by `count` descending.

## Project Structure (high-level)

```
src/
  App.jsx            # App shell, search, results, trending
  appwrite.js        # Appwrite client + helper functions
  components/
    MovieCard.jsx
    Search.jsx
    Spinner.jsx
  main.jsx           # React root
  index.css          # Tailwind entry + styles
public/              # Static assets (icons, images)
```

## Environment & API Details

- TMDB endpoints are called with an Authorization header: `Bearer ${VITE_TMDB_API_KEY}`.
- Appwrite client is initialized with `VITE_APPWRITE_PROJECT_ID` and queries the database/collection IDs provided.

## Troubleshooting

- 401/403 from TMDB: Ensure you used the v4 Read Access Token and placed it in `VITE_TMDB_API_KEY`.
- Empty Trending list: Verify Appwrite credentials, collection name/IDs, and that documents are being created/updated when searches succeed.
- Permission errors in Appwrite: For quick local testing, temporarily allow public Create/Update/Read. Secure properly for production.

## Acknowledgements

- Data provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.

---

Happy hacking!
