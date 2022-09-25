const {
	commandChannels
} = require('../config.json');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);

		//console.log(interaction);

		if (!interaction.isChatInputCommand()) return;

		if ((commandChannels.includes(interaction.channelId)) || (commandChannels.includes("*"))) {
			const command = interaction.client.commands.get(interaction.commandName);

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

		} else {
			return interaction.reply({
				content: 'You cant use commands in this channel!',
				ephemeral: true
			});

		}

	},
};