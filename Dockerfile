FROM node:22-alpine

# Install system deps
RUN apk add --no-cache \
  postgresql \
  postgresql-client \
  bash \
  su-exec

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy deps first
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy app source
COPY . .

# Prisma client
RUN pnpm prisma generate

# Build NestJS
RUN pnpm run build

# Create postgres data dir
RUN mkdir -p /var/lib/postgresql/data && chown -R postgres:postgres /var/lib/postgresql

# Expose API port only
EXPOSE 3000

# Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
