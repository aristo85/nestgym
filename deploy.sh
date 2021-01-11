#!/bin/bash

git checkout $1 && git pull origin $1 &&
cd getcoachadmin/ && git submodule init && git checkout $1 && git pull origin $1 &&

cd .. && 
docker-compose up -d --build &&
docker system prune -f &&
exit