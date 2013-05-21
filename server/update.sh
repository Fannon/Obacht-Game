#!/bin/sh
cd ..
git reset --hard HEAD
git pull
cd server
npm update
./start.sh
