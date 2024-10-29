FROM node:16-alpine as build
WORKDIR /app

RUN npm install -g @angular/cli@12.2.10
COPY ./package.json .
RUN npm install --force

ARG CONFIG=production
COPY . /app/
RUN ng build --configuration ${CONFIG}

FROM nginx:stable-alpine-slim

# RUN rm -f /var/log/nginx/*.log
RUN mkdir /usr/share/nginx/html/policy

COPY --from=build /app/nginx/policy /usr/share/nginx/html/policy

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 