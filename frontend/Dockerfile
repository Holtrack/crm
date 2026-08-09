FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --no-save vite@^8.2.0
COPY --from=build /app/dist ./dist
COPY preview.config.ts .
ENV VITE_PROXY_TARGET=http://backend:3000
ENV VITE_ALLOWED_HOSTS=
EXPOSE 80
CMD ["npx", "vite", "preview", "--config", "preview.config.ts", "--host", "0.0.0.0", "--port", "80"]
