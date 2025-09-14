@echo off
echo Limpiando el proyecto...

echo.
echo [1/5] Eliminando la carpeta node_modules...
if exist node_modules (rmdir /s /q node_modules)

echo.
echo [2/5] Eliminando la carpeta .expo...
if exist .expo (rmdir /s /q .expo)

echo.
echo [3/5] Limpiando la cache de npm...
npm cache clean --force

echo.
echo [4/5] Reinstalando todas las dependencias...
npm install

echo.
echo [5/5] Intentando compilar y ejecutar en Android...
npx expo run:android

echo.l
echo Proceso terminado.
pause