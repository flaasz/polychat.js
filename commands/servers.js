const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('Shows online servers!'),
    async execute(servers) {
        //console.log(servers.client.ingameServerData);

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Server List');


        Object.keys(servers.client.ingameServerData).forEach(key => {
            const statusEmoji = servers.client.emojis.cache.find(emoji => emoji.name === servers.client.ingameServerData[key].status);

            embed.addFields({
                name: `**${key}** ${servers.client.ingameServerData[key].name} ${statusEmoji}`,
                value: `${servers.client.ingameServerData[key].ip}`
            })

        });

        return servers.reply({
            embeds: [embed]
        });
    },
};