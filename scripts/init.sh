#!/bin/bash

echo "Waiting for MongoDB to start..." | tee -a /backup/init.log
until mongo --eval "print(\"waited for connection\")" &>/dev/null
do
    sleep 2
done

mongorestore --drop --db DealApp /backup/DealApp --verbose | tee -a /backup/init.log

echo "MongoDB restoration complete." | tee -a /backup/init.log
