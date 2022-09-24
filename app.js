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
	chatchannelid
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

const encoder = require("./modules/encoder.js");
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

client.on('messageCreate', message => {
	try {

		if (message.author.bot) return;
		if (message.channel != chatchannelid) return;
		//console.log(message);

		let processedMessage = `§9[Discord] §r${message.author.username}: ${message.content}`;

		message.mentions.users.forEach(u =>{
			let filter = new RegExp(`<@${u.id}>`, "g");
			processedMessage = processedMessage.replace(filter, `@${u.username}`);
		});

		message.attachments.forEach(a => {
			processedMessage = processedMessage + " " + a.url;
		});

		encoder.encodeMessage(clients, processedMessage);	
		console.log(processedMessage.replace(/§+[\w]/g, ''));

	} catch (error) {
		console.error('Error: ', error);
	}
});

server.listen(port, host);
console.log("Chat server online on port ", port, "!");
client.login(token);
console.log("App listening on port", port);