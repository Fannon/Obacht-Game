#!/bin/sh
# Evtl: sudo chmod +x update.sh

# Updates the Server. Needs sudo to work!

cd ..
git reset --hard HEAD
git pull origin master
cd server
npm update
chmod +x start.sh
./start.sh
