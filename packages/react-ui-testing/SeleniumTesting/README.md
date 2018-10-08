# установка зависимостей
```
npm install
npm run installpages
```
# запуск тестовых страниц и sauce connect
Необходимо создать файл *.env с переменными окружения для Sauce Labs и положить его в ./SeleniumTesting
```
npm start
```
# запуск тестов
установить .NET Core 2.1
```
dotnet build 
dotnet test ./TestsCore/TestsCore.csproj
```