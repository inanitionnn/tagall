# Deploying tagall on your VPS (GHCR + Docker)

After each push to `main`, GitHub Actions builds a standalone Next.js image and publishes it to GitHub Container Registry (GHCR). Use that image on your VPS.

## Image location

- **Image:** `ghcr.io/inanitionnn/tagall:latest` (all lowercase)
- **Optional pinned tag:** `ghcr.io/inanitionnn/tagall:sha-<short-sha>` (e.g. after a specific commit)

## GHCR access from the VPS

- **Public package:** If the GHCR package is public, pull without login:
  ```bash
  docker pull ghcr.io/inanitionnn/tagall:latest
  ```
- **Private package:** If the package is private, log in from the VPS (e.g. once per server):
  ```bash
  echo $GITHUB_PAT | docker login ghcr.io -u USERNAME --password-stdin
  ```
  Use a GitHub Personal Access Token (PAT) with `read:packages`. You can set the package to public in repo **Settings → Packages → Package visibility**.

## Docker Compose snippet

Add this service to your existing `docker-compose.yml` (adjust network name to match your setup, e.g. `media_network`):

```yaml
  tagall:
    image: ghcr.io/inanitionnn/tagall:latest
    container_name: tagall
    restart: unless-stopped
    env_file: .env   # or path to your env file; do not bake secrets into the image
    # Or list variables explicitly:
    # environment:
    #   - NODE_ENV=production
    #   - NEXTAUTH_URL=https://your-domain.com
    #   - DATABASE_URL=postgresql://...
    #   - NEXTAUTH_SECRET=...
    #   - ... (see .env.example for full list)
    networks:
      - media_network
```

- Do **not** expose port 3000 to the host unless you need direct access; put the app behind Nginx Proxy Manager (or your reverse proxy) and proxy to the container by service name and port 3000.
- In **Nginx Proxy Manager**: create a Proxy Host with **Forward Hostname / IP:** `tagall` (or the service name) and **Forward Port:** `3000`.

## Required environment variables

Set these in the container (via `env_file` or `environment`); the image does not contain secrets.

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | **Must be your public app URL** (e.g. `https://tagall.yourdomain.com`), not `localhost`. |
| `NEXTAUTH_SECRET` | Random string for NextAuth signing. |
| `DATABASE_URL` | PostgreSQL connection string (e.g. Neon, or your own Postgres). |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth. |
| `ALLOWED_EMAILS` | Comma-separated emails allowed to sign in. |
| `SECRET_CLIENT_COOKIE_VAR` | JWK for client cookie encryption (see `.env.example`). |
| `OPENAI_API_KEY` | OpenAI API key. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis. |
| `CLOUDINARY_*` / `NEXT_PUBLIC_CLOUDINARY_*` | Cloudinary config. |
| `SCRAPING_ANT_API_KEY` | ScrapingAnt API key. |
| Qstash (optional) | `QSTASH_*` if you use Qstash. |

See `.env.example` in the repo for the full list and comments.

## Database migrations

Migrations are **not** run automatically when the container starts. Apply them before or after deploying a new image.

**Option A – From your machine (recommended):**  
Point `DATABASE_URL` in `.env` to the production DB and run:

```bash
pnpm db:migrate
```

**Option B – One-off container:**  
Run Prisma migrate from a temporary container that has network access to the DB and the same `DATABASE_URL`. The published image does not include the Prisma CLI; you would need a separate “migrator” image or a local run as in Option A.

## Updating the app

1. Push to `main` → Actions build and push a new `latest` (and `sha-<short-sha>`) to GHCR.
2. On the VPS, pull and recreate:
   ```bash
   docker compose pull tagall
   docker compose up -d tagall
   ```
   If you use Watchtower, it can pull and restart the container when a new image is available.

## Summary

- Image: `ghcr.io/inanitionnn/tagall:latest`
- Set `NEXTAUTH_URL` to your public URL.
- Provide all secrets via `env_file` or `environment`, never in the image.
- Run `pnpm db:migrate` (or equivalent) for schema changes.
- Put the app behind your reverse proxy (e.g. NPM) with hostname = service name, port 3000.
