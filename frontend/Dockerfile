FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

# Install nginx for serving production build
RUN apk add --no-cache nginx

# Copy built files for nginx to serve
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy source files and dependencies for running tests
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/vite.config.js ./vite.config.js
COPY --from=builder /app/tailwind.config.js ./tailwind.config.js
COPY --from=builder /app/postcss.config.js ./postcss.config.js
COPY --from=builder /app/index.html ./index.html

# Create nginx configuration directory if it doesn't exist
RUN mkdir -p /etc/nginx/conf.d

# Copy nginx server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create mime.types file with essential MIME types
RUN echo 'types {' > /etc/nginx/mime.types && \
    echo '    text/html                             html htm shtml;' >> /etc/nginx/mime.types && \
    echo '    text/css                              css;' >> /etc/nginx/mime.types && \
    echo '    application/javascript                js mjs;' >> /etc/nginx/mime.types && \
    echo '    application/json                      json;' >> /etc/nginx/mime.types && \
    echo '    image/png                             png;' >> /etc/nginx/mime.types && \
    echo '    image/jpeg                            jpg jpeg;' >> /etc/nginx/mime.types && \
    echo '    image/svg+xml                         svg svgz;' >> /etc/nginx/mime.types && \
    echo '    image/webp                            webp;' >> /etc/nginx/mime.types && \
    echo '    image/x-icon                          ico;' >> /etc/nginx/mime.types && \
    echo '    font/woff2                            woff2;' >> /etc/nginx/mime.types && \
    echo '    font/woff                             woff;' >> /etc/nginx/mime.types && \
    echo '}' >> /etc/nginx/mime.types

# Create main nginx.conf
RUN echo 'events {' > /etc/nginx/nginx.conf && \
    echo '    worker_connections 1024;' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf && \
    echo 'http {' >> /etc/nginx/nginx.conf && \
    echo '    include /etc/nginx/mime.types;' >> /etc/nginx/nginx.conf && \
    echo '    default_type application/octet-stream;' >> /etc/nginx/nginx.conf && \
    echo '    include /etc/nginx/conf.d/*.conf;' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf

EXPOSE 80

# Start nginx in foreground, but Node.js/npm remain available for tests
CMD ["nginx", "-g", "daemon off;"]

