#!/bin/bash

(
    git checkout $1 && git pull origin $1 &&
    git submodule init && git submodule update && cd getcoachadmin/ && git checkout $1 && git pull origin $1 &&

    cd .. && 
    docker-compose up -d --build &&
    docker system prune -f &&
    exit
) &
disown %1