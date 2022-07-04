FROM node:lts

WORKDIR /webapp-ts-template-api/

COPY ./package.json ./

RUN yarn install

RUN yarn add typescript

COPY . .

RUN yarn tsc

EXPOSE 1337

CMD ["node", "./build"]