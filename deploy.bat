@echo off

echo "Start deployment"
cd C:\App\forSale
echo "pulling source code..."
@REM git reset --hard origin/master
@REM git clean -f
@REM git pull
@REM git checkout master
@REM npm install
npm run start
echo "Finished."