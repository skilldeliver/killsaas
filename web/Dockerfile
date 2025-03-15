# Base stage for dependencies and building
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies only when needed
COPY package.json ./
RUN npm install

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js telemetry is disabled by default in production
ENV NEXT_TELEMETRY_DISABLED 1
# Bypass ESLint checks for Docker build
RUN npm run build -- --no-lint

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Use the non-root user
USER nextjs

# Expose the application port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
