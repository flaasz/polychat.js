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
            .setColor(0x9c59b6)
            .setTitle('Server List')
            .setTimestamp()
            .setFooter({
                text: "To see players online use /online"
            });

        let onlineCount = 0;
        let serverCount = 0;

        Object.keys(servers.client.ingameServerData).forEach(key => {

            serverCount++;

            let onlinePlayerCount = servers.client.ingameServerData[key].list.length;

            onlineCount += onlinePlayerCount;

            const statusEmoji = servers.client.emojis.cache.find(emoji => emoji.name === servers.client.ingameServerData[key].status);

            embed.addFields({
                name: `**${key}** ${servers.client.ingameServerData[key].name} ${statusEmoji}`,
                value: `${servers.client.ingameServerData[key].ip}`,
            });

        });

        embed.setDescription(`Players online: ${onlineCount} | Servers online: ${serverCount}`);


        return servers.reply({
            embeds: [embed]
        });
    },
};