@echo off

echo "Start deployment"
@REM cd C:\App\forSale
echo "pulling source code..."
git reset --hard origin/master
git clean -f
git pull
git checkout master
call npm install
forever restart ./bin/www
@REM npm run start
echo "Finished."