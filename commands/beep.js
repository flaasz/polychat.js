const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('beep')
		.setDescription('Beep!')
		.setDefaultMemberPermissions(2),
	async execute(interaction) {
		return interaction.reply('Boop!');
	},
};