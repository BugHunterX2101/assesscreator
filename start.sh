#!/bin/bash

# Start Redis
redis-server --daemonize yes

# Start MongoDB
mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db

# Export ports and environment variables
export PORT=7860
export NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
export NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws
export GROQ_API_KEY="${GROQ_API_KEY}"

# Start the backend in the background
cd backend
npm run start &

# Start the frontend in the foreground
cd ../frontend
PORT=7860 npm run start
