#!/bin/bash

WEB_PATH='C:/App/forSale'

echo "Start deployment"
C: && cd $WEB_PATH
echo "pulling source code..."
git reset --hard origin/master
git clean -f
git pull
git checkout master
npm install
npm run start
echo "Finished."