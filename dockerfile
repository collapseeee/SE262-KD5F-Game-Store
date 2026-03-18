FROM node:24-alpine
WORKDIR /app
RUN npm install -g pnpm
RUN npm install nodemon --save-dev
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile && pnpm store prune
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "dev"]
