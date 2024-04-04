# Prospeum coding challenge 
This is an Angular project that visualizes a questionnaire that can be answered by users.
There are three types of questions: single choice, multi choice and text; some questions are displayed conditionally.

## Getting started 
1. `npm i`
2. `npm run start`

## Run tests
`npm run test`

## Run linter
`npm run lint`

## Build static bundle locally
`npm run build`

## Build and serve the app using Docker

### Create a Docker image
`docker build -t prospeum:v1 .`

### Run the docker container
`docker run -p 8080:80 prospeum:v1`

This will run the app on `8080` local port, now you can open the url `http://localhost:8080` and can check the app  
