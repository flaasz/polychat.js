const protobuf = require("protobufjs");

const {
    chatchannelid, botLogo
} = require("../config.json");

const {
    EmbedBuilder
} = require('discord.js');

const embed = new EmbedBuilder();


let serverInfo = {};

module.exports = {

    decode: async function (data, socket, clients, bot) {
        broadcast(data, socket);

        data = data.slice(4);

        //console.log(data);
        //console.log(data.length);

        protobuf.load("./protos/any.proto", function (err, root) {
            if (err) throw err;

            var wrap = root.lookupType("google.protobuf.Any");


            try {
                var unwrapped = wrap.decode(data);
            } catch (e) {
                console.log(data.length);

                return console.log(e);

            }

            console.log(unwrapped);
            var output = {
                name: "",
                content: "",
                avatar: "",
                bonus: "",
            };

            protobuf.load("./protos/polychat.proto", async function (err, root) {
                if (err) throw err;

                let type = unwrapped.typeUrl.split("/").pop();

                var pc = root.lookupType(type);

                var decoded = pc.decode(unwrapped.value)
                console.log(decoded);

                if (type == "polychat.ServerInfo") {

                    let newServerInfo = {
                        [`[${decoded.serverId}]`]: {
                            name: decoded.serverName,
                            id: decoded.serverId,
                            ip: decoded.serverAddress,
                            max: decoded.maxPlayers
                        }
                    }

                    serverInfo = Object.assign(serverInfo, newServerInfo);

                    console.log(`${decoded.serverId} server registered!`);
                    console.log(serverInfo);

                }


                if (type == "polychat.ServerPlayerStatusChangedEvent") {
                    if (decoded.newPlayerStatus == 1) {
                        console.log(decoded.playerUsername, "joined the game!");
                        output.content = `**${decoded.playerUsername}** joined the game!`;

                    } else if (decoded.newPlayerStatus == 2) {
                        console.log(decoded.playerUsername, "left the game!");
                        output.content = `**${decoded.playerUsername}** left the game!`;

                    } else {
                        return console.log("Player changed status, but an error occured!");
                    }
                    output.name = serverInfo[`[${decoded.serverId}]`].name;
                    output.avatar = `https://mc-heads.net/head/${decoded.playerUsername}`;
                    sendMessage(output);

                }

                if (type == "polychat.ChatMessage") {
                    var nick = decoded.message.replace(/§+[\w]|<|>/g, '').split(' ')[1];

                    console.log(decoded.message.replace(/§+[\w]/g, ''));
                    output.name = `${nick} ${decoded.serverId.replace(/§+[\w]/g, '')}`;
                    output.content = `${decoded.message.replace(/§+[\w]|\[(.*?)\]|<(.*?)\>/g, '')}`;
                    output.avatar = `https://mc-heads.net/head/${nick}`;
                    sendMessage(output);
                }

                if (type == "polychat.ServerStatus") {
                    if (decoded.status == 1) {
                        console.log(`${decoded.serverId} server started!`);
                            embed.setColor(0x00ff91);
                            embed.setAuthor({
                                name: 'Server started!'
                            });

                    }
                    if (decoded.status == 2) {
                        console.log(`${decoded.serverId} server stopped!`);
                            embed.setColor(0xde1f5e);
                            embed.setAuthor({
                                name: 'Server stopped!'
                            });

                    }
                    if (decoded.status == 3) {
                        console.log(`${decoded.serverId} server crashed!`);
                            embed.setColor(0xde791f);
                            embed.setAuthor({
                                name: 'Server crashed!'
                            });

                    }
                    else {
                        console.log(`${decoded.serverId} server changed status, but an error occured!`);
                    }

                    output.name = serverInfo[`[${decoded.serverId}]`].name;
                    output.avatar = botLogo;
                    sendEmbed(output, embed);

                }

            });

        });

        function broadcast(message, sender) {
            clients.forEach(function (client) {
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
}