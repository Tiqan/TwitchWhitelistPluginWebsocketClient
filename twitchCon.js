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
		username: "ChargeOrion",
		password: config.BotOAuth
	},
	channels: ["Tiqan_"]
}

var orion = new tmi.client(options)

module.exports = {orion}