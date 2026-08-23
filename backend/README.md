# FitHit Backend

Simple Node.js + Express backend using Prisma and PostgreSQL for the FitHit frontend.

Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Generate Prisma client and run migrations (creates schema in your DB):

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Seed demo admin/user:

```bash
npm run seed
```

5. Run dev server:

```bash
npm run dev
```

API overview

- `POST /api/auth/register` - register
- `POST /api/auth/login` - login
- `GET /api/users` - list users
- `GET /api/memberships` - list memberships
- `POST /api/payments` - create payment
- `PUT /api/payments/:id/approve` - approve payment (creates/updates membership)

Security notes

- Do NOT commit `backend/.env` — it is ignored by `.gitignore`.
- Set a strong `JWT_SECRET` in `backend/.env` before starting the server. The server will refuse to start if `JWT_SECRET` is left as the default value.
- Use `pgAdmin` or similar to manage your Postgres user/password. Avoid using the `postgres` superuser for application connections in production.
- The server enables basic HTTP hardening (Helmet) and a simple rate limiter. For production, add CORS origin restrictions and consider more advanced rate limiting and monitoring.

Client integration

Authenticate via `POST /api/auth/login` to receive a JWT. Include the token as `Authorization: Bearer <token>` when calling protected endpoints.

Adapt routes to the frontend as needed. The frontend currently reads/writes localStorage; switch client calls to these endpoints and persist tokens in client storage.
