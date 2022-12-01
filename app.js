require("./deploy-commands.js");

const fs = require('node:fs');
const path = require('node:path');
const logger = require("./modules/logger.js");

const {
	Client,
	Collection,
	GatewayIntentBits
} = require('discord.js');

const {
	token,
	port,
	host,
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

client.serverData = [];
client.ingameServerData = {};
client.commandData = {};

var server = net.createServer(function (socket) {
	socket.name = socket.remoteAddress + ":" + socket.remotePort;
	client.serverData.push(socket);

	//console.log(client);

	socket.on("error", (err) => {
		logger.error("Caught server socket error: ");
		logger.error(err.stack);
	});

	socket.on('data', function (data) {
		decoder.decode(data, socket, client);
	});
});

require("./modules/announcer.js").startAnnouncer(client.serverData);

require('crashreporter').configure({
	outDir: "./crash-logs",
	exitOnCrash: true
});

server.listen(port, host);
logger.info("Chat server online on port ",port,"!");
client.login(token);
logger.info("App listening on port", port);

