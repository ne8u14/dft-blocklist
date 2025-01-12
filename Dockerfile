FROM node:16.14.2 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

COPY prisma ./prisma/

COPY tsconfig.json ./

COPY .env ./

COPY src ./src

RUN npx prisma generate

RUN npm run build

FROM node:16.14.2 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]