FROM node:14.9 as build

USER root

WORKDIR /web

COPY . .

RUN pwd

RUN yarn

# RUN yarn start

CMD [ "yarn", "start"]

EXPOSE 3000

# RUN yarn build
# RUN mkdir -p /var/www
# COPY --from=build /web /var/www/
