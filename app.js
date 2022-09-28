require("./deploy-commands.js");

const fs = require('node:fs');
const path = require('node:path');
const {
	Client,
	Collection,
	GatewayIntentBits
} = require('discord.js');
const {
	token,
	port,
	host,
	chatchannelid,
} = require('./config.json');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	]
});


const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

/* CHAT SERVER */

const decoder = require("./modules/decoder.js");
const net = require('net');



client.serverData = new Array();
client.ingameServerData = new Object();
client.commandData = new Object();

var server = net.createServer(function (socket) {
	socket.name = socket.remoteAddress + ":" + socket.remotePort;
	client.serverData.push(socket);

	//console.log(client);

	socket.on("error", (err) => {
		console.log("Caught server socket error: ");
		console.log(err.stack);
	})

	socket.on('data', function (data) {
		decoder.decode(data, socket, client);
	});


});

server.listen(port, host);
console.log("Chat server online on port ", port, "!");
client.login(token);
console.log("App listening on port", port);

//console.log(client);