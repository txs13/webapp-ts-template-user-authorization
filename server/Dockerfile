FROM node:lts

WORKDIR /webapp-ts-template-api/

COPY ./package.json ./

RUN yarn install

COPY . .

RUN yarn tsc

EXPOSE 1337

CMD ["node", "./build"]