#!/bin/bash

# Kill all running containers
docker kill $(docker ps -q) 2> /dev/null
# Delete all containers
docker rm $(docker ps -aq) 2> /dev/null

# Build application
docker build --tag username/repository:tag .

# Start application
docker-compose up