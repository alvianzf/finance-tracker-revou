# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build NestJS app
RUN pnpm run build

# Stage 2: Runtime stage
FROM node:22-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only production dependencies
COPY package*.json ./
RUN pnpm install --prod

# Copy built NestJS code
COPY --from=builder /app/dist ./dist

# Copy Prisma client (generated) to node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port for API
EXPOSE 3000

# Run Prisma migrate + seed + start app
CMD sh -c "pnpm prisma generate && pnpm prisma migrate deploy && pnpm prisma db seed && node dist/main.js"
