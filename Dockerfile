# 1. Install dependencies only when needed
# CHANGED: Updated from 18 to 20
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json to install dependencies
COPY package.json package-lock.json ./ 
RUN npm ci

# 2. Rebuild the source code only when needed
# CHANGED: Updated from 18 to 20
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# This will create the .next folder and the standalone folder
RUN npm run build

# 3. Production image, copy all the files and run next
# CHANGED: Updated from 18 to 20
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a group and user so we aren't running as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]