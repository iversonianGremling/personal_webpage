# In personal_webpage/Dockerfile
FROM node:18 AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Make sure this uses .env.production
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
