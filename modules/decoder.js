var protobuf = require("protobufjs");


module.exports = {

    decode: function (data, socket, clients) {
        broadcast(data, socket);
        protobuf.load("./protos/any.proto", function (err, root) {
            if (err) throw err;

            var wrap = root.lookupType("google.protobuf.Any");

            var unwrapped = wrap.decode(data);

            protobuf.load("./protos/polychat.proto", function (err, root) {
                if (err) throw err;

                let type = unwrapped.typeUrl.split("/").pop();

                var pc = root.lookupType(type);

                var decoded = pc.decode(unwrapped.value);

                console.log(type);

                if (type == "polychat.ServerPlayerStatusChangedEvent") {
                    if (decoded.newPlayerStatus == 1) {
                        console.log(decoded.playerUsername," joined the game!");
                    }
                    else if (decoded.newPlayerStatus == 2) {
                        console.log(decoded.playerUsername," left the game!");
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