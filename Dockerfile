FROM node:16-stretch-slim as debug
LABEL author="<pergerk@gmail.com> Abakar Kuliev"
WORKDIR /app/
RUN yarn install

FROM node:16-stretch-slim as build
LABEL author="<pergerk@gmail.com> Abakar Kuliev"

WORKDIR /app/
COPY . .
RUN apt-get update
RUN apt-get install bzip2
RUN yarn install && yarn build

FROM node:16-stretch-slim as server
WORKDIR /app/
RUN apt-get update && apt-get install -y fontconfig
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/dist /app/dist
COPY --from=build /app/ormconfig.js /app/ormconfig.js
COPY --from=build /app/templates /app/templates

CMD yarn start:prod