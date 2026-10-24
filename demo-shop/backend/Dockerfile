FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY src ./src

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "src/server.js"]
