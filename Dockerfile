# ---------- Build React Frontend ----------
FROM node:20 AS client-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ .
RUN npm run build

# ---------- Build Express Backend ----------
FROM node:20

WORKDIR /app

COPY Server/package*.json ./Server/
WORKDIR /app/Server

RUN npm install

COPY Server/ .

# Copy React build into the Express server
COPY --from=client-build /app/client/build ./client/build

ENV PORT=7860
EXPOSE 7860

CMD ["npm", "start"]