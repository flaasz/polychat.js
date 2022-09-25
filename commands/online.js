const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('online')
        .setDescription('Shows online players!'),
    async execute(online) {
        //console.log(online.client.ingameServerData);

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Players Online');


        Object.keys(online.client.ingameServerData).forEach(key => {

			let onlinePlayerCount = online.client.ingameServerData[key].list.length;

			if (onlinePlayerCount > 0) {

				embed.addFields({
					name: `**${key}** ${online.client.ingameServerData[key].name}`,
					value: `**${onlinePlayerCount}/${online.client.ingameServerData[key].max}** ${online.client.ingameServerData[key].list.toString()}\n${online.client.ingameServerData[key].ip}`
				})	
			}

        });

        return online.reply({
            embeds: [embed]
        });
    },
};