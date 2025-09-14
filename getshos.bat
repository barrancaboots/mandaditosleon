@echo off
echo Obteniendo registro de errores detallado de Gradle...

echo.
echo Navegando a la carpeta 'android'...
cd android

echo.
echo Ejecutando la compilacion con --stacktrace...
gradlew app:assembleDebug --stacktrace

echo.
echo Volviendo a la carpeta raiz...
cd ..

echo.
echo Proceso de diagnostico terminado. Revisa el resultado de arriba.
pause