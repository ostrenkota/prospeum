# build the bundle
FROM node:20 as build-step
RUN mkdir -p /project
RUN npm cache clear --force
WORKDIR /project
COPY . /project
RUN npm install
RUN npm run build

# set up the static webserver
FROM nginx
COPY --from=build-step /project/dist/prospeum/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
