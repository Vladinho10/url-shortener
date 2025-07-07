# Stage 1: Build the application
FROM node:20.18.1-alpine AS builder

WORKDIR /app

# Verify yarn version and update if needed (instead of reinstalling)
RUN yarn --version && \
    if [ "$(yarn --version)" != "1.22.22" ]; then \
      npm install -g yarn@1.22.22 --force; \
    fi

# Copy package files first for better caching
COPY package.json yarn.lock ./

# Install all dependencies
RUN yarn

# Copy source files
COPY . .

# Build the application
RUN yarn run build

# Copy production environment file
COPY ./src/envs/.env.production .env

EXPOSE 4000

RUN ls -la /app/dist

CMD ["node", "dist/src/main.js"]