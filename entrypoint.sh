#!/bin/sh
set -e

echo "Starting Postgres..."

# Init DB if first run
if [ ! -s "/var/lib/postgresql/data/PG_VERSION" ]; then
  su-exec postgres initdb -D /var/lib/postgresql/data
fi

# Start Postgres
su-exec postgres postgres -D /var/lib/postgresql/data &
POSTGRES_PID=$!

# Wait for Postgres
echo "Waiting for Postgres..."
until pg_isready -h localhost -p 5432; do
  sleep 1
done

echo "Postgres is ready"

# Create DB if not exists
psql -U postgres -h localhost -tc "SELECT 1 FROM pg_database WHERE datname = 'finance'" | grep -q 1 || \
psql -U postgres -h localhost -c "CREATE DATABASE finance"

# Prisma migrate + seed
echo "Running Prisma migrate"
pnpm prisma migrate deploy

echo "Seeding database"
pnpm prisma db seed || true

# Start app
echo "Starting NestJS"
node dist/main.js

wait $POSTGRES_PID
