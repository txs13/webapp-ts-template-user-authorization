FROM node:lts as build

WORKDIR /webapp-ts-template-client/

COPY /package.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:stable

COPY --from=build /webapp-ts-template-client/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]