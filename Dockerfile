FROM node:20

# Install Redis and MongoDB
RUN apt-get update && apt-get install -y \
    redis-server \
    gnupg \
    curl \
    && curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
       gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor \
    && echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
       tee /etc/apt/sources.list.d/mongodb-org-7.0.list \
    && apt-get update \
    && apt-get install -y mongodb-org

WORKDIR /app

# Copy root configs
COPY package*.json ./
COPY tsconfig*.json ./

# Copy packages
COPY packages/ ./packages/
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Install and build
RUN npm install
RUN npm run build --workspaces

# Expose port (HF Spaces routes traffic to 7860)
EXPOSE 7860

COPY start.sh .
RUN chmod +x start.sh

# Setup MongoDB data directory
RUN mkdir -p /data/db

CMD ["./start.sh"]
