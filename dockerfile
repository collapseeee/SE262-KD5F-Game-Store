FROM node:24-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile && pnpm store prune
COPY . .
EXPOSE 3000
CMD [ "pnpm", "dev"]
