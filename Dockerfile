# Stage 1 - build dependencies
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Stage 2 - production image
FROM node:22-alpine
WORKDIR /app

# Copy only needed files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENV NODE_ENV=production
ENV RUN_SEED=false

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
