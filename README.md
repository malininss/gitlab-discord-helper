# gitlab-discord-helper

The bot is designed to simplify sending messages about created Merge Requests to a Discord chat.


## Discord Bot Setup Guide

1. Create an application on the page [https://discord.com/developers/applications](https://discord.com/developers/applications)
2. Enter to your application and navigate to the `Bot` tab.
3. In the "Privileged Gateway Intents" section, enable "SERVER MEMBERS INTENT" and click "Save."
4. Click on Reset Token, copy the token, and add an environment variable to your `.env` file in your application: `BOT_OAUTH_KEY=#YOUR_TOKEN#`.
5. Go to the OAuth2 page.
6. Copy the CLIENT ID and insert it into your `.env` file in your application: `BOT_ID=#CLIENT ID#`.
7. In the `SCOPES` section, select `Bot`. In the `Bot Permissions` section, choose the following permissions: `Manage Roles`, `Read Messages/View Channels`, `Send Messages`, `Create Public Threads`, `Create Private Threads`, `Send Messages In Threads`, `Manage Threads`, `Mention Everyone`, `Use Slash Commands`. Alternatively, choose the `Administrator` permission.
8. Copy the URL from the `GENERATED URL` section, go to this link, and add the bot to your server.


## Set up project
1. Setup all env variables according to the .env.dist file (create .env file with correct) 
1. Instal dependencies
    ```
    bun install
    ```

## Local development

1. Start DB container:
    ```
    docker-compose up mongo -d
    ```
1. Register bot slash command
    ```
    bun register
    ```
1. Start project
    ```
    bun dev
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
