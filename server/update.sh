#!/bin/sh

# Updates the Server. Needs sudo to work!

cd ..
git reset --hard HEAD
git pull
cd server
npm update
chmod +x start.sh
./start.sh
