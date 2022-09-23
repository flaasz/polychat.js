const protobuf = require("protobufjs");

const { chatchannelid } = require("../config.json");


module.exports = {

    decode: async function (data, socket, clients, bot) {
        broadcast(data, socket);
        protobuf.load("./protos/any.proto", function (err, root) {
            if (err) throw err;

            var wrap = root.lookupType("google.protobuf.Any");

            var unwrapped = wrap.decode(data);

            protobuf.load("./protos/polychat.proto", async function (err, root) {
                if (err) throw err;

                let type = unwrapped.typeUrl.split("/").pop();

                var pc = root.lookupType(type);

                var decoded = pc.decode(unwrapped.value);

                console.log(decoded);

                if (type == "polychat.ServerPlayerStatusChangedEvent") {
                    if (decoded.newPlayerStatus == 1) {
                        console.log(decoded.playerUsername,"joined the game!");
                        const channel = bot.channels.cache.get(chatchannelid);
                        try {
                            const webhooks = await channel.fetchWebhooks();
                            const webhook = webhooks.find(wh => wh.token);
                
                            if (!webhook) {
                                return console.log('No webhook was found that I can use!');
                            }
                
                            await webhook.send({
                                content: `${decoded.playerUsername} joined the game!`,
                                username: `${decoded.newPlayersOnline.serverId} Server`,
                                avatarURL: `https://mc-heads.net/head/${decoded.playerUsername}`,
                            });
                        } catch (error) {
                            console.error('Error trying to send: ', error);
                        }
                
                    }
                    else if (decoded.newPlayerStatus == 2) {
                        console.log(decoded.playerUsername,"left the game!");
                        const channel = bot.channels.cache.get(chatchannelid);
                        try {
                            const webhooks = await channel.fetchWebhooks();
                            const webhook = webhooks.find(wh => wh.token);
                
                            if (!webhook) {
                                return console.log('No webhook was found that I can use!');
                            }
                
                            await webhook.send({
                                content: `${decoded.playerUsername} left the game!`,
                                username: `${decoded.newPlayersOnline.serverId} Server`,
                                avatarURL: `https://mc-heads.net/head/${decoded.playerUsername}`,
                            });
                        } catch (error) {
                            console.error('Error trying to send: ', error);
                        }

                    }
                    else {
                        console.log("Player changed status, but an error occured!");
                    }
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

    }
}