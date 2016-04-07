#!/bin/bash
set -e

DOCKER_REGISTRY="dockerep-0.mtl.mnubo.com"
DOCKER_REGISTRY_PROD="dockerep-1.mtl.mnubo.com:4329"
VERSION="1.02-20160407"
NAME="scores-dashboard"

docker build -t $DOCKER_REGISTRY/$NAME:$VERSION -f Dockerfile_complete .

docker tag -f $DOCKER_REGISTRY/$NAME:$VERSION $DOCKER_REGISTRY/$NAME:latest
docker tag  -f $DOCKER_REGISTRY/$NAME:$VERSION $DOCKER_REGISTRY_PROD/$NAME:$VERSION

docker push  $DOCKER_REGISTRY/$NAME:$VERSION
docker push  $DOCKER_REGISTRY_PROD/$NAME:$VERSION

# for production front end
#docker run -t -p 300x:3000  -e NODE_ENV="production" <image ID>
# for development front end code
# docker run -t -p 300x:3000  -e NODE_ENV="development" <image ID>

#docker run -d -p 9009:9009 --name scores-dashboard <docker image>
