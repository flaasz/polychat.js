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
	port
} = require('./config.json');

const client = new Client({
	intents: [GatewayIntentBits.Guilds]
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

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true
		});
	}
});



/* CHAT SERVER */


const decoder = require("./modules/decoder.js");
const net = require('net');


var clients = [];

var server = net.createServer(function (socket) {
	socket.name = socket.remoteAddress + ":" + socket.remotePort;
	clients.push(socket);

	socket.on('data', function (data) {
		decoder.decode(data, socket, clients, client);
	});

});

server.listen(port, '127.0.0.1');
console.log("Chat server online on port ", port, "!");
client.login(token);
console.log("App listening on port", port);
