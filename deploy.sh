#!/bin/bash

git checkout $0 && git pull
cd getcoachadmin/ && git checkout $0 && git pull 

docker-compose up -d --build
docker system prune -f