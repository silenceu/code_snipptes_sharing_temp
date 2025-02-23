# Hooked Academy Backend

## Tech Stacks
1. Golang 1.20+
2. MongoDB 4/5
3. [Google API Library for Go](https://github.com/googleapis/google-api-go-client)
4. [Dotenv](https://github.com/joho/godotenv)
5. Gin

## Deploy (Linux Server)
1. Configure `.env`

    creat a new `.env` file from `.env.example` and fill it with the expected configurations
    ```dotenv
    HTTP_PORT=8080
    GIN_MODE=release
    GOOGLE_CLIENT_ID= # Google Oauth2 client ID
    MONGODB_URL=mongodb://{username}:{password}@{host}:{port} # MongoDB connection uri
    DB_NAME=hookedacademy # database name
    ```

2. Build
   ```bash
   go build -o ./bin/hooked_academy_server
   ```

3. Deploy

   a. Create DB Index on Mongo
   ```js
   db.getCollection("users").createIndex({ "email": 1 }, {"unique": true})
   db.getCollection("users").createIndex({ "createdAt": 1 })
   ```
   b. Start the server(Linux)
   ```bash
   sudo nodup ./bin/hooked_academy_server nohup_hooked_academy_server.log 2>&1 &
   ```
4. \[Options\] Stop the server

    find the pid via `ps -ef | grep hooked_academy_server` command, and `kill -TERM ${pid}`

## Deploy (DockerFile)
1. Create DB Index on Mongo
   ```js
   db.getCollection("users").createIndex({ "email": 1 }, {"unique": true})
   db.getCollection("users").createIndex({ "createdAt": 1 })
   ```
2. Set ENVs when start docker container
   Tips: HTTP_PORT is fixed 8080 when uses Dockerfile
    ```dotenv
    GOOGLE_CLIENT_ID= # Google Oauth2 client ID
    MONGODB_URL=mongodb://{username}:{password}@{host}:{port} # MongoDB connection uri
    DB_NAME=hookedacademy # database name
    ```