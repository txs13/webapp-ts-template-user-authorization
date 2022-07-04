FROM node:lts

WORKDIR /webapp-ts-template-api/

COPY ./package.json ./

RUN yarn install

RUN yarn add typescript

COPY . .

RUN yarn tsc

CMD ["node", "./build"]