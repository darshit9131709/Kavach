# Kavach Architecture Notes

This repo follows a lightweight layered approach to keep features modular and production-friendly.

## Layers

- **UI (Presentation)**: `src/app/**`, `src/components/**`
  - Pages and layouts are responsible for rendering and user interaction.
  - Shared UI primitives live in `src/components/ui/**`.

- **Application / Feature Services**: `src/lib/services/**`
  - Encapsulates feature logic and database/model access.
  - API routes call these services rather than embedding model queries directly.

- **Domain / Persistence**: `src/models/**`
  - Mongoose schemas and model-level validation.

- **Infrastructure**: `src/lib/mongodb.js`, `src/lib/auth.js`, `src/middleware.js`

## API structure

- API routes live in `src/app/api/**/route.js`.
- Common controller helpers live in:
  - `src/lib/api-helpers.js`
  - `src/lib/errors.js`

## Security & production notes

- Use strong secrets in production:
  - `NEXTAUTH_SECRET`
  - `JWT_SECRET`
- Ensure `MONGODB_URI` points to a production-grade cluster and indexes are applied.

### Rate limiting (recommended)

Rate limiting is not implemented yet, but should be added before production:

- Authentication endpoints (registration and credentials sign-in)
- `/api/sos`, `/api/location`, `/api/chat`
- Any admin mutation routes

Suggested strategy:
- Per-IP limits for unauthenticated traffic
- Per-user limits for authenticated traffic
- Use a shared store (Redis/KV) for multi-instance deployments

