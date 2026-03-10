# FinnyTrack AI Finance Tracker

## Requirements
- Node.js 18+ (recommended 20+)
- A Postgres database (Neon recommended)
- Clerk keys for auth
- Optional: OpenAI API key for AI advice

## Setup
1. Install dependencies:
   `npm install`

2. Create a local env file:
   `copy .env.example .env.local`

3. Fill in `.env.local` with your keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_DATABASE_URL` (required for current client-side DB usage)
   - `DATABASE_URL` (recommended for migrations)
   - `OPENAI_API_KEY` (optional)

4. Create the database tables:
   `npm run db:push`

5. Run the app:
   `npm run dev`

## Drizzle migrations
Generated migrations are stored in `drizzle/`. If the folder is empty, run:
- `npm run db:generate`
- `npm run db:push`

## Deployment note
The current UI calls the database directly from client components. This requires using `NEXT_PUBLIC_DATABASE_URL`, which exposes the database connection string in the browser. For production deployment, move database access into API routes or server components and use `DATABASE_URL` only.

AI advice now uses a server route. Keep `OPENAI_API_KEY` server-side and avoid `NEXT_PUBLIC_OPENAI_API_KEY`.
