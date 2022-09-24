const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		let time = new Date();
		await interaction.reply('Ping?');
		time = new Date() - time;
		await interaction.editReply(`Pong! **${time}ms**`);
	},
};