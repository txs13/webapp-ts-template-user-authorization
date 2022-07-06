FROM node:lts as build

WORKDIR /webapp-ts-template-client/

COPY /package.json ./

RUN yarn install

COPY . .

ENV REACT_APP_DOCKER_MODE DOCKER_PROD

RUN yarn build

FROM nginx:stable

COPY --from=build /webapp-ts-template-client/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]