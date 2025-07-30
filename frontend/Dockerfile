# Fichier: frontend/Dockerfile

# --- Stage 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /app

# Installer pnpm
RUN npm install -g pnpm

# Copier les fichiers de dépendances et installer
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copier le reste du code et construire l'application
COPY . .
RUN pnpm build

# --- Stage 2: Runner ---
FROM node:20-alpine AS runner

WORKDIR /app

# Copier les fichiers de build, les dépendances de prod et le code nécessaire
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Lancer l'application
CMD ["pnpm", "start"]