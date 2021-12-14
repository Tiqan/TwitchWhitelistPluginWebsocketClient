//Modules
var tmi = require('tmi.js')

//Imports
var config = require('./config/bot')


var options = {
    options: {
        debug: true
    },
    connection: {
        secure: true,
        reconnect: true
    },
	identity: {
		username: config.botUsername,
		password: config.BotOAuth
	},
	channels: config.channels
}

var orion = new tmi.client(options)

module.exports = {orion}