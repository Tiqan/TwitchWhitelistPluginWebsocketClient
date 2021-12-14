# TwitchWhitelistPluginWebsocketClient
A Node JS App which is a Websocket for my Minecraft Plugin to Whitelist People on my Minecraft Server(Tiqan.de). [Twitch Chat Whitelist Websocket Client](https://github.com/TiqanGH/TwitchWhitelistPlugin) is needed


## Installation:
1. Clone this repository
2. Create a Folder called "config" in the main folder
3. Create 2 Files (1. bot.js 2. config.json)
4. Paste the sample into the bot.js and edit the oauth token
5. Paste the second sample into the config.json and edit the values

## Start:
1. Open a cmd and cd to your folder
2. execute 'node ./client.js'

## How you get the Values:

### Bot.js:
#### BotOAuth:
1. Open a Browser and log in to the Twitch Bot Account
2. Open https://twitchapps.com/tmi/
3. Click connect and copy the Token and paste it into the bot.js File
#### botUsername:
Just enter the username of your bot
#### channels:
Paste the channels into the ' ' where the bot should be

### Config.json
#### Client Id:
1. Create a new app at https://dev.twitch.tv/console/apps
2. Copy the Client id and paste it into the config
3. Create a new secret and copy it too (you need it for the next step)

#### AuthToken:
Make an api Request to the url https://id.twitch.tv/oauth2/token with the headers: client_id, client_secret, grant_type=client_credentials
(You got the values client_id and client_secret one step earlier)
Then as a response you get the access_token which is the authToken
#### To Id:
Make an api Request to the url https://api.twitch.tv/helix/users?login=UserName with the headers: Client-ID=xxxxxxxxxxxxxxxxxx
and Authorization=Bearer xxxxxxxxxxxxxxxxxxxxxxx 

After Bearer paste the access_token you got earlier
Replace the UserName in the URL with the channel that should be followed to join



### Sample bot.js
```js
var BotOAuth = 'oauth:xxxxxxxxxxxxxxxxxxxxxxxx'
var botUsername = 'MyBotName'
var channels = ['Channel1', 'Channel2']

module.exports = {BotOAuth}
```

### Sample config.json
```json
{
    "authToken": "xxxxxxxxxxxxxxxxxxxxxxx",
    "clientId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "toId": "xxxxxxxxx"
}

