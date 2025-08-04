#!/bin/sh
set -e

echo "🚀 Starting container..."

# Pastikan NODE_ENV ada
NODE_ENV=${NODE_ENV:-production}
echo "📦 Environment: $NODE_ENV"

# Install dependency kalau belum ada (untuk safety di image custom)
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm ci --only=production
fi

# Generate Prisma Client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Apply migrations (production-safe)
if [ "$NODE_ENV" = "production" ]; then
  echo "🛠 Running prisma migrate deploy..."
  npx prisma migrate deploy
fi

# Seed jika diminta
if [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Running seed..."
  npx prisma db seed
fi

# Start app
echo "🏁 Starting app..."
npm run start
