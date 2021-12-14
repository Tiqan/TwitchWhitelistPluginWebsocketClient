const WebSocket = require('ws')
var fs = require("fs");
const axios = require("axios")

const serverAdress = "ws://127.0.0.1:7888/"

var chalk = require('chalk');

var configTwitch = require('./config/config.json')

var {
    orion
} = require('./twitchCon.js');


function connect() {
    var ws = new WebSocket(serverAdress);
    ws.onopen = function() {
        orion.connect();

        orion.on('connected', function (adress, port) {
            console.log(`${chalk.blue.bold('Server:')} ${adress} ${chalk.blue.bold('Port:')} ${port}`)
        })
    
    
    
        orion.on('chat', function (channel, user, message, _self) {
            if (_self) return;
            run(orion, channel, user, message, _self);
        });
    
    
        function run(orion, channel, user, message, _self) {
    
            var msg = message.split(' ')
            var command = msg[0].toLowerCase();
            msg.shift();
    
            
    
            var args = msg
            var isMod = user.mod
            var isSub = user.subscriber
            var userName = user.username;
            switch (command) {
    
                case '!verify':
                    if (args.length == 1 && args[0].length >= 3 && args[0].length <= 16) {
    
    
                        var status;
                        var isFollowing = false;
                        var NAME = args[0]
    
                        const BASE_URL = `https://api.mojang.com/users/profiles/minecraft/${NAME}`
    
    
                        axios.default.get(BASE_URL).then((resp) => {
                        
                            status = resp.data
                            if(status) {
                                console.log(status)
                            }
                            
                        })
    
                        const BASE_URL1 = `https://api.twitch.tv/helix/users/follows?from_id=${user['user-id']}&to_id=${configTwitch.toId}`
                        let config = {
                            headers: {
                                'Authorization': `Bearer ${configTwitch.authToken}`,
                                "Client-ID": configTwitch.clientId
                            }
                        }
                        
                        axios.default.get(BASE_URL1, config).then((resp) => {
                        
                            console.log("YE  " + resp.data)
                            if(resp.data.total > 0) {
                                isFollowing = true
                                
                            }
                            
                        })
                        
    
                        setTimeout(() => {
    
                            if(isFollowing || user['display-name'].toLocaleLowerCase() == "tiqan_") {
                                if (status) {
                                    fs.readFile("usernames.json", "utf-8", (err, data) => {
                                        if (err) {
                                            console.log(err)
                                        }
        
                                        if (data === "") {
                                            var defaultArray = {
                                                "DEFAULT....DEFAULT": ["DEFAULT....DEFAULT"]
                                            }
                                            fs.writeFile("usernames.json", JSON.stringify(defaultArray), (err) => {
                                                if (err) {
                                                    console.log(err)
                                                }
                                            })
                                        }
        
                                        setTimeout(() => {
                                            fs.readFile("usernames.json", "utf-8", (err, data) => {
                                                if (err) {
                                                    console.log(err)
                                                }
        
        
        
                                                //convert string to json
        
                                                var usernames = JSON.parse(data)
        
                                                var objValues = Object.values(usernames)
        
                                                var values = [];
        
                                                objValues.forEach(e => {
                                                    e.forEach(i => {
                                                        values.push(i)
                                                    })
                                                });
        
                                                if (!(values.includes(args[0]))) {
                                                    if (user['display-name'].toLocaleLowerCase() == "tiqan_") {
                                                        ws.send(args[0])
                                                        orion.say(channel, "User verifiziert: " + args[0]);
                                                    } else if (!(user['display-name'].toLocaleLowerCase() in usernames)) {
                                                        ws.send(args[0])
                                                        var displayName = user['display-name'].toLocaleLowerCase()
        
        
                                                        usernames = addToObject(usernames, displayName, [args[0]])
        
                                                        console.log(usernames)
                                                        userNameString = JSON.stringify(usernames)
                                                        fs.writeFile("usernames.json", userNameString, (err) => {
                                                            if (err) {
                                                                console.log(err)
                                                            }
                                                        })
                                                        orion.say(channel, "Minecraft Account verifiziert: " + args[0]);
                                                    } else if (user['display-name'].toLocaleLowerCase() in usernames) {
                                                        if (countProperties(usernames[user['display-name'].toLocaleLowerCase()]) >= 2) {
                                                            orion.say(channel, "Minecraft Account konnte nicht verifiziert werden! Du hast schon 2 Accounts verknüpft!")
                                                        } else {
                                                            ws.send(args[0])
        
                                                            var displayName = user['display-name'].toLocaleLowerCase()
        
                                                            var minecraftAccounts = [usernames[user['display-name'].toLocaleLowerCase()][0], args[0]]
        
                                                            usernames = addToObject(usernames, displayName, minecraftAccounts)
        
                                                            userNameString = JSON.stringify(usernames)
                                                            fs.writeFile("usernames.json", userNameString, (err) => {
                                                                if (err) {
                                                                    console.log(err)
                                                                }
                                                            })
        
                                                            orion.say(channel, "Minecraft Account verifiziert: " + args[0]);
                                                        }
                                                    } else {
                                                        orion.say(channel, "Minecraft Account konnte nicht verifiziert werden!");
                                                    }
                                                } else {
                                                    orion.say(channel, "Dieser Account wurde schon verifiziert");
                                                }
        
        
        
        
                                            })
                                        }, 30)
        
        
                                    })
                                } else {
                                    orion.say(channel, "Diesen Minecraft Account gibt es nicht!")
                                }
                            }else {
                                orion.say(channel, "Du musst Tiqan folgen um dich zu verifizieren!")
                            }
    
    
                        }, 500)
    
    
    
                    }
                    break;
                case "!disconnect":
                    if (args.length == 1) {
                        fs.readFile("usernames.json", "utf-8", (err, data) => {
                            if (err) {
                                console.log(err)
                            }
    
                            if (data === "") {
                                var defaultArray = {
                                    "DEFAULT....DEFAULT": ["DEFAULT....DEFAULT"]
                                }
                                fs.writeFile("usernames.json", JSON.stringify(defaultArray), (err) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                })
                            }
    
                            setTimeout(() => {
                                fs.readFile("usernames.json", "utf-8", (err, data) => {
                                    if (err) {
                                        console.log(err)
                                    }
    
                                    //convert string to json
    
                                    var usernames = JSON.parse(data)
    
                                    if(usernames[user['display-name'].toLocaleLowerCase()] != undefined) {
                                        var objValues = Object.values(usernames[user['display-name'].toLocaleLowerCase()])
    
                                        var values = [];
        
                                        objValues.forEach(e => {
                                            values.push(e)
                                        });
        
                                        if (user['display-name'].toLocaleLowerCase() in usernames && values.includes(args[0]) && values.length == 1) {
        
                                            delete usernames[user['display-name'].toLocaleLowerCase()]
        
                                            userNameString = JSON.stringify(usernames)
                                            fs.writeFile("usernames.json", userNameString, (err) => {
                                                if (err) {
                                                    console.log(err)
                                                }
                                            })
    
                                            orion.say(channel, "Dieser Account wurde getrennt!");
        
                                        }
        
                                        if (user['display-name'].toLocaleLowerCase() in usernames && values.includes(args[0]) && values.length == 2) {
        
                                            var indexOfMCName = usernames[user['display-name'].toLocaleLowerCase()].indexOf(args[0])
                                            console.log(indexOfMCName)
                                            console.log(usernames[user['display-name'].toLocaleLowerCase()][indexOfMCName])
        
                                            var newNames = "";
        
                                            if (indexOfMCName == 1) {
                                                newNames = usernames[user['display-name'].toLocaleLowerCase()][0]
                                            }
                                            if (indexOfMCName == 0) {
                                                newNames = usernames[user['display-name'].toLocaleLowerCase()][1]
                                            }
        
                                            var displayName = user['display-name'].toLocaleLowerCase()
        
        
                                            usernames = addToObject(usernames, displayName, [newNames])
        
                                            console.log(usernames)
                                            userNameString = JSON.stringify(usernames)
                                            fs.writeFile("usernames.json", userNameString, (err) => {
                                                if (err) {
                                                    console.log(err)
                                                }
                                            })
    
                                            orion.say(channel, "Dieser Account wurde getrennt!");
        
                                        }
                                    }
    
    
    
                                })
                            }, 20)
    
                        })
                    }
    
    
                    break;
    
    
            }
        }
      
    };

    ws.onclose = function(e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function() {
          connect();
        }, 1000);
      };
    
      ws.onerror = function(err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        ws.close();
      };



}


connect()


var addToObject = function (obj, key, value, index) {

    // Create a temp object and index variable
    var temp = {}
    var i = 0

    // Loop through the original object
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {

            // If the indexes match, add the new item
            if (i === index && key && value) {
                temp[key] = value
            }

            // Add the current item in the loop to the temp obj
            temp[prop] = obj[prop]

            // Increase the count
            i++

        }
    }

    // If no index, add to the end
    if (!index && key && value) {
        temp[key] = value
    }

    return temp;

}


function countProperties(obj) {
    var count = 0;

    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}