FROM node:20.19.2-alpine AS build

WORKDIR /usr/src/app
COPY . .
RUN yarn install --frozen-lockfile && yarn build


FROM nginx:1.27.0 AS production-stage

RUN mkdir /app
COPY --from=build /usr/src/app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
COPY runtime_nginx_port.sh /docker-entrypoint.d/runtime_nginx_port.sh
RUN chmod +x /docker-entrypoint.d/runtime_nginx_port.sh

EXPOSE ${PORT}
