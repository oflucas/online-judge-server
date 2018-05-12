#!/bin/bash

# kill apps that using ports
fuser -k 3000/tcp
fuser -k 5000/tcp

service redis_6379 start

# In online-judge-server/
npm install
nodemon server.js &

# In online-judge-client/
cd ../online-judge-client
npm install
ng build --watch

# In online-judge-executor/
cd ../online-judge-executor
pip install -r requirements.txt
python executer_server.py 5000

echo "=================================================="
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

fuser -k 3000/tcp
fuser -k 5000/tcp
service redis_6379 stop
