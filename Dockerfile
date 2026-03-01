# Stage 1: Install dependencies + download Playwright Chromium
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.5 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts
# Download Chromium for Playwright (used for IMDB scraping)
RUN pnpm exec playwright install chromium
# cp -rL recursively follows ALL symlinks (including nested pnpm store symlinks like playwright-core),
# producing a fully-resolved directory that can be safely COPYed into runner without broken symlinks.
RUN cp -rL node_modules/playwright /playwright-resolved

# Stage 2: Build application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV SKIP_ENV_VALIDATION=1

# NEXT_PUBLIC_* vars must be available at build time as they are inlined into the JS bundle
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_CLOUDINARY_FOLDER
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV NEXT_PUBLIC_CLOUDINARY_FOLDER=$NEXT_PUBLIC_CLOUDINARY_FOLDER

RUN corepack enable && corepack prepare pnpm@8.15.5 --activate
RUN pnpm prisma generate
RUN pnpm build

# Stage 3: Production runtime
# node:20-slim (Debian Bookworm) is required for Chromium system libraries
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install Chromium system dependencies required by Playwright at runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libwayland-client0 \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs --create-home nextjs

# Copy pre-downloaded Chromium browser from deps stage
COPY --from=deps /root/.cache/ms-playwright /home/nextjs/.cache/ms-playwright
RUN chown -R nextjs:nodejs /home/nextjs/.cache

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy the fully-resolved playwright directory (no pnpm symlinks) from deps stage.
COPY --from=deps --chown=nextjs:nodejs /playwright-resolved ./node_modules/playwright

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Tell Playwright where to find the pre-downloaded Chromium
ENV PLAYWRIGHT_BROWSERS_PATH=/home/nextjs/.cache/ms-playwright

CMD ["node", "server.js"]
