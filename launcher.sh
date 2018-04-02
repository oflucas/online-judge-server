#!/bin/bash

# kill apps that using ports
fuser -k 3000/tcp
fuser -k 5000/tcp

service redis_6379 start
cd ./oj-server
npm install
nodemon server.js &
cd ../oj-client
npm install
ng build --watch

pip install -r requirements.txt
python executer_server.py

echo "=================================================="
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

fuser -k 3000/tcp
fuser -k 5000/tcp
service redis_6379 stop
