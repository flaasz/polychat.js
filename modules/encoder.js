const protobuf = require("protobufjs");


module.exports = {
    encodeMessage: async function (clients, encodedMessage) {
        protobuf.load("./protos/polychat.proto", function (err, root) {
            if (err)
                throw err;

            let newMessage = {
                serverId: '[Discord]',
                message: encodedMessage,
                messageOffset: encodedMessage.length
            };

            var type = root.lookupType("polychat.ChatMessage");

            var payload = type.create(newMessage);

            //console.log(newMessage);

            var buffer = type.encode(payload).finish();

            protobuf.load("./protos/any.proto", function (err, root) {
                if (err)
                    throw err;

                let encodedMessage = {
                    typeUrl: 'type.googleapis.com/polychat.ChatMessage',
                    value: buffer
                };

                //console.log(encodedMessage);

                var anytype = root.lookupType("google.protobuf.Any");

                var encodedPayload = anytype.create(encodedMessage);

                var data = anytype.encode(encodedPayload).finish();

                //console.log(anytype.decode(data));
                //console.log(data.length);

                var datalen = new Buffer.alloc(4);
                datalen.writeUInt32BE(data.length, 0);

                data = Buffer.concat([datalen, data]);

                //console.log("datalen: ",data);

                return clients.forEach(function (client) {
                    client.write(data);
                });

            });
        });

    },
    encodeAnnouncement: async function (clients, encodedAnnouncement) {
        protobuf.load("./protos/polychat.proto", function (err, root) {
            if (err)
                throw err;

            let newMessage = {
                serverId: '[INFO]',
                message: encodedAnnouncement,
                messageOffset: encodedAnnouncement.length
            };

            var type = root.lookupType("polychat.ChatMessage");

            var payload = type.create(newMessage);

            //console.log(newMessage);

            var buffer = type.encode(payload).finish();

            protobuf.load("./protos/any.proto", function (err, root) {
                if (err)
                    throw err;

                let encodedAnnouncement = {
                    typeUrl: 'type.googleapis.com/polychat.ChatMessage',
                    value: buffer
                };

                //console.log(encodedAnnouncement);

                var anytype = root.lookupType("google.protobuf.Any");

                var encodedPayload = anytype.create(encodedAnnouncement);

                var data = anytype.encode(encodedPayload).finish();

                //console.log(anytype.decode(data));
                //console.log(data.length);

                var datalen = new Buffer.alloc(4);
                datalen.writeUInt32BE(data.length, 0);

                data = Buffer.concat([datalen, data]);

                //console.log("datalen: ",data);

                return clients.forEach(function (client) {
                    client.write(data);
                });

            });
        });

    },
    encodeCommand: async function (interaction, encodedCommand) {

        let toSend = interaction.client.serverData.reverse().find(o => o.serverId === encodedCommand.serverId);

        if(!toSend) return interaction.editReply("Wrong Server ID!");

        protobuf.load("./protos/polychat.proto", function (err, root) {
            if (err)
                throw err;

            let newCommand = {
                args: encodedCommand.command,
                discordChannelId: encodedCommand.interactionId,
                discordCommandName: 'exec',
                defaultCommand: '$args'
            };

            var type = root.lookupType("polychat.GenericCommand");

            var payload = type.create(newCommand);

            //console.log(newCommand);

            var buffer = type.encode(payload).finish();

            protobuf.load("./protos/any.proto", function (err, root) {
                if (err)
                    throw err;

                let preparedCommand = {
                    typeUrl: 'type.googleapis.com/polychat.GenericCommand',
                    value: buffer
                };

                //console.log(encodedAnnouncement);

                var anytype = root.lookupType("google.protobuf.Any");

                var encodedPayload = anytype.create(preparedCommand);

                var data = anytype.encode(encodedPayload).finish();

                //console.log(anytype.decode(data));
                //console.log(data.length);

                var datalen = new Buffer.alloc(4);
                datalen.writeUInt32BE(data.length, 0);

                data = Buffer.concat([datalen, data]);

                //console.log(client.serverData);
                //console.log(encodedCommand);

                return toSend.write(data);
            });
        });
    }
};