#!/bin/bash

case "$1" in
    start)
        mongod --dbpath utils/db.js --fork --logpath /var/log/mongod.log
        ;;
    stop)
        pkill mongod
        ;;
    status)
        pgrep -fl mongod
        ;;
    *)
        echo "Usage: $0 {start|stop|status}"
        exit 1
esac
