# MicroLearn

A daily micro-learning app: pick your interests, get a beautifully animated stack of 4–6 cards that teaches one concept in ~60 seconds.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS v4
- **Framer Motion** for card animations
- **Prisma** + SQLite (local) / PostgreSQL (production)
- **OpenRouter** for AI lesson generation

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Configure environment — copy `.env.example` to `.env` and add your OpenRouter key:

```env
DATABASE_URL="file:./dev.db"
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL="anthropic/claude-sonnet-4"
CRON_SECRET=your-random-secret
```

Any model on [OpenRouter](https://openrouter.ai/models) works via `OPENROUTER_MODEL`.

3. Initialize the database:

```bash
npm run db:push
```

4. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → onboarding → today's drop.

## OpenRouter

Lessons are generated server-side in `lib/openrouter.ts`. The API key never reaches the client.

## Routes

| Route | Description |
|---|---|
| `/` | Today's card stack |
| `/onboarding` | Pick interests + depth |
| `/library` | Saved cards |
| `POST /api/drops/generate` | Generate or return today's drop |
| `GET /api/cron/daily` | Daily pre-generation (Bearer `CRON_SECRET`) |

See `microlearn-build-plan.md` for the full spec.
