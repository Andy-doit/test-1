# HotStock Backend

A high-performance backend API for HotStock, built with NestJS, Fastify, Prisma, and PostgreSQL.

## Prerequisites

- **Node.js**: v20 or higher
- **Docker** and **Docker Compose**: For local infrastructure (DB, Redis)
- **Git**: Version control

## Tech Stack

- **Framework**: NestJS 11 (with Fastify Adapter)
- **Database**: PostgreSQL 16
- **ORM**: Prisma 6
- **Caching & Queue**: Redis 7, BullMQ, ioredis
- **Authentication**: Passport-JWT, Argon2
- **Logging**: Pino (pino-http, pino-pretty)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger (@nestjs/swagger)
- **Cloud Storage**: AWS SDK S3 v3 (Pre-signed URLs)

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd hotstock-be-v1
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   *Fill in the values in `.env` based on your local setup (see variables table).*

3. **Start Local Infrastructure**
   ```bash
   docker-compose up -d
   ```
   *This will start PostgreSQL, Redis, and PgBouncer.*

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Run Database Migrations**
   ```bash
   npm run db:migrate
   ```

6. **Seed the Database**
   ```bash
   npm run db:seed
   ```
   *This creates 4 default plans (Free, Titan, Premium, Gold) and the default admin account.*

7. **Start the Application**
   ```bash
   npm run start:dev
   ```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | The port the application will run on | `3000` |
| `NODE_ENV` | Application environment | `development` / `staging` / `production` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000,https://app.hotstock.vn` |
| `API_PREFIX` | Global API prefix | `api/v1` |
| `DATABASE_URL` | Transactional DB connection (PgBouncer) | `postgresql://user:pass@localhost:6432/appdb?pgbouncer=true` |
| `DIRECT_URL` | Direct Postgres connection (Migrations) | `postgresql://user:pass@localhost:5432/appdb` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password (if any) | `redis-password` |
| `JWT_ACCESS_SECRET` | Secret key for access token | `your-secret-access-key` |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifespan | `15m` |
| `JWT_REFRESH_SECRET` | Secret key for refresh token | `your-secret-refresh-key` |
| `JWT_REFRESH_EXPIRES_IN`| Refresh token lifespan | `7d` |
| `SMTP_HOST` | SMTP server host | `smtp.mailtrap.io` |
| `SMTP_USER` | SMTP username | `user` |
| `AWS_S3_BUCKET` | AWS S3 Bucket Name | `hotstock-uploads` |
| `SEED_ADMIN_EMAIL` | Initial admin email | `admin@app.com` |
| `SEED_ADMIN_PASSWORD` | Initial admin password | `strong-password` |
| `BULL_BOARD_USER` | Username for Queue Dashboard | `admin` |
| `BULL_BOARD_PASS` | Password for Queue Dashboard | `admin-pass` |

## Database Commands

- `npm run db:migrate` — Create and apply a new migration (dev only).
- `npm run db:migrate:deploy` — Apply pending migrations (production/staging).
- `npm run db:generate` — Regenerate Prisma client.
- `npm run db:seed` — Seed initial data (plans & admin).
- `npm run db:studio` — Open Prisma Studio at `http://localhost:5555`.
- `npm run db:reset` — Reset database (**WARNING:** deletes all data).

## Default Admin Account

- **Email**: `admin@app.com`
- **Password**: *Value of `SEED_ADMIN_PASSWORD` in your `.env`*

> ⚠️ **IMPORTANT**: Change this password immediately after your first login in production environments.

## API Documentation (Swagger)

Available at: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
*(Only enabled in `development` and `staging` when `NODE_ENV !== "production"`)*

**How to authenticate**:
1. Login to get an access token.
2. Click the **Authorize** button in Swagger.
3. Enter `Bearer <your_access_token>`.

## Bull Board (Queue UI)

Available at: [http://localhost:3000/admin/queues](http://localhost:3000/admin/queues)
*(Dev only — disabled in production)*

Login with the credentials set in `BULL_BOARD_USER` and `BULL_BOARD_PASS` from your `.env` file.

## Role System

| Role | Permissions |
|------|-------------|
| `user` | Can read content based on their plan level. |
| `editor` | Can CRUD articles, portfolios, and categories. Cannot manage plans or users. |
| `admin` | Full system access. |

## Plan System

| Plan | Level | Access |
|------|-------|--------|
| **Free** | `0` | Basic content |
| **Titan** | `1` | Starter content |
| **Premium** | `2` | Advanced content |
| **Gold** | `3` | All content |

## API Endpoints Overview

### Auth (`/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login and get JWT tokens
- `POST /refresh` - Refresh access token
- `POST /change-password` - Change password (Auth)
- `POST /forgot-password` - Request password reset OTP
- `POST /verify-otp` - Verify OTP
- `POST /reset-password` - Reset password

### Users (`/users`)
- `GET /profile` - Get own profile (Auth)
- `PATCH /profile` - Update own profile (Auth)
- `GET /` - List all users (Admin only)
- `PATCH /:id/role` - Update user role (Admin only)
- `PATCH /:id/plan` - Assign plan to user (Admin only)
- `POST /:id/block` - Block user (Admin only)
- `POST /:id/unblock` - Unblock user (Admin only)

### Plans (`/plans`)
- `GET /` - List all plans
- `GET /:slug` - Get plan details
- `POST /` - Create plan (Admin only)
- `PATCH /:id` - Update plan (Admin only)
- `DELETE /:id` - Delete plan (Admin only)

### Categories (`/categories`)
- `GET /` - List all categories
- `POST /` - Create category (Admin/Editor)
- `PATCH /:id` - Update category (Admin/Editor)
- `DELETE /:id` - Delete category (Admin/Editor)

### Articles (`/articles`)
- `GET /` - List articles (Optional Auth, filtered by Plan)
- `GET /:slug` - Get article details (Optional Auth, checked by Plan)
- `POST /` - Create article (Admin/Editor)
- `PATCH /:id` - Update article (Admin/Editor)
- `DELETE /:id` - Delete article (Admin/Editor)

### Portfolios (`/portfolios`)
- `GET /` - List latest portfolios by plan (Optional Auth, checked by Plan)
- `POST /` - Create portfolio entry (Admin/Editor)
- `PATCH /:id` - Update portfolio entry (Admin/Editor)
- `DELETE /:id` - Delete portfolio entry (Admin/Editor)

### Uploads (`/uploads`)
- `POST /presign` - Generate AWS S3 pre-signed URL (Auth)

### Health (`/health`)
- `GET /` - System health check (DB, Redis)

## Deploy to Staging

1. Push your changes to the `staging` branch.
2. GitHub Actions will automatically:
   - Build the Docker image.
   - Push the image to `ghcr.io`.
   - SSH into the staging server.
   - Pull the new image.
   - Run `docker compose up -d`.
   - Run `prisma migrate deploy`.
   - Verify the `/api/v1/health` endpoint.
3. **Required GitHub Secrets**:
   - `STAGING_HOST`
   - `STAGING_USER`
   - `STAGING_SSH_KEY`
   - `STAGING_PORT`
   - `GITHUB_TOKEN` (provided by GH Actions automatically, just needs proper permissions).

## Running Tests

- `npm run test` — Run unit tests
- `npm run test:watch` — Run unit tests in watch mode
- `npm run test:cov` — Run tests with coverage report
- `npm run test:e2e` — Run end-to-end tests

## Troubleshooting

- **Database Connection Errors**: Verify `DATABASE_URL` is pointing to the PgBouncer port (`6432` locally, `5432` inside docker for pgbouncer depending on config) and that the database container is healthy.
- **Redis Connection Errors**: Ensure `REDIS_HOST` and `REDIS_PORT` are correct. If using Docker Desktop on Windows/Mac, `localhost` is correct.
- **Prisma Client Not Generated**: Run `npm run db:generate`.
- **JWT Secret Too Short**: Ensure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are at least 32 characters long.
- **Bull Board Not Showing**: Make sure you are setting `BULL_BOARD_USER` and `BULL_BOARD_PASS` in `.env` and `NODE_ENV` is not `production`.
