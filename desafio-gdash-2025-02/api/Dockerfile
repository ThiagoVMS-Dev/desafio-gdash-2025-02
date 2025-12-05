FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./ 
RUN npm ci --omit=dev || npm i
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || true
EXPOSE 3000
CMD ["node", "dist/main.js"]
