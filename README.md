# gitlab-discord-helper

The bot is designed to simplify sending messages about created Merge Requests to a Discord chat.

## Local development

1. Start DB container:
    ```
    docker-compose up mongo -d
    ```
1. Start project
    ```
    bun run dev
    ```

## Production start

1. Launch all containers
    ```
      docker-compose up -d
    ```
1. You rock!

## Notes
- To stop containers fire `docker-compose down`
- MONGO_DB_URL env variable for local host should be local launching, and mongo (equal to the container name) for launching in docker
