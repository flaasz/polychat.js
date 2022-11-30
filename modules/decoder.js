const protobuf = require("protobufjs");

const {
    chatchannelid,
    botLogo
} = require("../config.json");

const {
    EmbedBuilder
} = require('discord.js');

const embed = new EmbedBuilder();

module.exports = {

    decode: async function (data, socket, bot) {

        let dataToReturn = data;
        data = data.slice(4);

        //console.log(data);
        //console.log(data.length);

        protobuf.load("./protos/any.proto", function (err, root) {
            if (err) throw err;

            var wrap = root.lookupType("google.protobuf.Any");

            try {
                var unwrapped = wrap.decode(data);
                //console.log(unwrapped);
            } catch (e) {
                console.log(data.length);
                return console.log(e);
            }

            var output = {
                name: "",
                content: "",
                avatar: "",
                bonus: "",
            };

            try {
                protobuf.load("./protos/polychat.proto", async function (err, root) {
                    if (err) throw err;

                    let type = unwrapped.typeUrl.split("/").pop();

                    let pc;

                    try {
                        pc = root.lookupType(type);
                    } catch (e) {
                        return console.log(e);
                    }

                    broadcast(dataToReturn, socket);

                    var decoded = pc.decode(unwrapped.value);
                    //console.log(decoded);

                    if (type == "polychat.ServerInfo") {

                        let newServerInfo = {
                            [`[${decoded.serverId}]`]: {
                                name: decoded.serverName,
                                id: decoded.serverId,
                                ip: decoded.serverAddress,
                                max: decoded.maxPlayers,
                                status: "online",
                                list: []
                            }
                        };

                        socket.serverId = decoded.serverId.toUpperCase();
                        console.log(socket.name);

                        //console.log(bot.serverData);

                        bot.ingameServerData = Object.assign(bot.ingameServerData, newServerInfo);

                        console.log(`${decoded.serverId} server registered!`);
                        //console.log(serverInfo);
                    }

                    if (type == "polychat.ServerPlayerStatusChangedEvent") {
                        if (decoded.newPlayerStatus == 1) {

                            bot.ingameServerData[decoded.newPlayersOnline.serverId.replace(/§+[\w]/g, '')].list = decoded.newPlayersOnline.playerNames;

                            console.log(decoded.playerUsername, "joined the game!");
                            output.content = `**${decoded.playerUsername}** joined the game!`;

                            //console.log(bot.ingameServerData);

                        } else if (decoded.newPlayerStatus == 2) {

                            let playerList = decoded.newPlayersOnline.playerNames;

                            const playerIndex = playerList.indexOf(decoded.playerUsername);
                            if (playerIndex > -1) {
                                playerList.splice(playerIndex, 1);
                            }

                            bot.ingameServerData[decoded.newPlayersOnline.serverId.replace(/§+[\w]/g, '')].list = playerList;

                            console.log(decoded.playerUsername, "left the game!");
                            output.content = `**${decoded.playerUsername}** left the game!`;

                            //console.log(bot.ingameServerData);

                        } else {
                            return console.log("Player changed status, but an error occured!");
                        }

                        output.name = bot.ingameServerData[`${decoded.newPlayersOnline.serverId.replace(/§+[\w]/g, '')}`].name;
                        output.avatar = `https://mc-heads.net/head/${decoded.playerUsername}`;
                        sendMessage(output);
                    }

                    if (type == "polychat.ChatMessage") {
                        var nick = decoded.message.replace(/§+[\w]/g, '').match(/<(.*?)>/)[1];

                        console.log(decoded.message.replace(/§+[\w]/g, ''));
                        output.name = `${nick} ${decoded.serverId.replace(/§+[\w]/g, '')}`;
                        output.content = `${decoded.message.replace(/§+[\w]/g, '').replace(/\[(.*?)\]\s<(.*?)\>\s/, '')}`;
                        output.avatar = `https://mc-heads.net/head/${nick.split(" ")[nick.split(" ").length - 1]}`;
                        sendMessage(output);
                    }

                    if (type == "polychat.ServerPlayersOnline") {

                        console.log(`${decoded.serverId.replace(/§+[\w]/g, '')} list updated!`);
                        try {
                            bot.ingameServerData[decoded.serverId.replace(/§+[\w]/g, '')].list = decoded.playerNames;
                        } catch (e) {
                            console.log(e);
                            socket.end();
                        }

                        //console.log(bot.ingameServerData);
                    }

                    if (type == "polychat.ServerStatus") {
                        if (decoded.status == 1) {
                            try {
                                bot.ingameServerData[`[${decoded.serverId}]`].status = "online";
                            } catch (e) {
                                console.log(e);
                                socket.end();
                            }
                            console.log(`${decoded.serverId} server started!`);
                            embed.setColor(0x00ff91);
                            embed.setAuthor({
                                name: 'Server started!'
                            });
                        }
                        if (decoded.status == 2) {
                            try {
                                bot.ingameServerData[`[${decoded.serverId}]`].status = "offline";
                            } catch (e) {
                                console.log(e);
                                socket.end();
                            }
                            console.log(`${decoded.serverId} server stopped!`);
                            embed.setColor(0xde1f5e);
                            embed.setAuthor({
                                name: 'Server stopped!'
                            });
                        }
                        if (decoded.status == 3) {
                            try {
                                bot.ingameServerData[`[${decoded.serverId}]`].status = "crashed";
                            } catch (e) {
                                console.log(e);
                                socket.end();
                            }
                            console.log(`${decoded.serverId} server crashed!`);
                            embed.setColor(0xde791f);
                            embed.setAuthor({
                                name: 'Server crashed!'
                            });
                        }

                        try {
                            output.name = bot.ingameServerData[`[${decoded.serverId}]`].name;
                        } catch (e) {
                            console.log(e);
                            output.name = `[${decoded.serverId}] Server`;
                        }
                        output.avatar = botLogo;
                        sendEmbed(output, embed);
                    }

                    if (type == "polychat.GenericCommandResult") {

                        //console.log(bot);

                        try {
                            let resumedInteraction = bot.commandData[`[${decoded.discordChannelId}]`].interaction;
                            resumedInteraction.editReply(decoded.commandOutput.replace(/§+[\w]/g, ''));
                            delete bot.commandData[`[${decoded.discordChannelId}]`];

                        } catch (e) {
                            console.log(e);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });

        function broadcast(message, sender) {
            bot.serverData.forEach(function (client) {
                // Don't want to send it to sender
                if (client === sender) return;
                client.write(message);
            });
            // Log it to the server output too
            //process.stdout.write(message)
        }

        async function sendMessage(output) {
            const channel = bot.channels.cache.get(chatchannelid);
            try {
                const webhooks = await channel.fetchWebhooks();
                const webhook = webhooks.find(wh => wh.token);

                if (!webhook) {
                    return console.log('Error fetching a webhook! Restart the bot to fix that issue.');
                }

                await webhook.send({
                    content: output.content,
                    username: output.name,
                    avatarURL: output.avatar,
                });
            } catch (error) {
                console.error('Error trying to send: ', error);
            }
        }

        async function sendEmbed(output, embed) {
            const channel = bot.channels.cache.get(chatchannelid);
            try {
                const webhooks = await channel.fetchWebhooks();
                const webhook = webhooks.find(wh => wh.token);

                if (!webhook) {
                    return console.log('Error fetching a webhook! Restart the bot to fix that issue.');
                }

                await webhook.send({
                    content: output.content,
                    username: output.name,
                    avatarURL: output.avatar,
                    embeds: [embed]
                });
            } catch (error) {
                console.error('Error trying to send: ', error);
            }
        }
    }
};