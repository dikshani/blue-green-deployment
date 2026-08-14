FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install express cors --omit=dev
COPY server.js ./
EXPOSE 5000
CMD ["npm", "start"]
