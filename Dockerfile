# ---------- Builder stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm at a fixed version (match your lockfile)
RUN npm install -g pnpm@8.15.4

# Copy dependency files first
COPY package.json pnpm-lock.yaml ./

# Install deps
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build NestJS
RUN pnpm run build


# ---------- Runtime stage ----------
FROM node:22-alpine

WORKDIR /app

# Install pnpm (same version, no surprises)
RUN npm install -g pnpm@8.15.4

# Copy only what runtime needs
COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Expose API port
EXPOSE 3000

# Start app
CMD ["node", "dist/main.js"]
