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
            .setColor(0x9c59b6)
            .setTimestamp()
            .setFooter({
                text: "To see all available servers use /servers"
            });

        let onlineCount = 0;
        let serverCount = 0;

        Object.keys(online.client.ingameServerData).forEach(key => {

            serverCount++;

            let onlinePlayerCount = online.client.ingameServerData[key].list.length;

            onlineCount += onlinePlayerCount;

            if (onlinePlayerCount > 0) {

                embed.addFields({
                    name: `**${key}** ${online.client.ingameServerData[key].name}`,
                    value: `**${onlinePlayerCount}/${online.client.ingameServerData[key].max}** ${online.client.ingameServerData[key].list.toString().replace(/,/g, ", ")}\n${online.client.ingameServerData[key].ip}`
                });
            }

        });

        if (onlineCount == 0) {
            embed.addFields({
                name: `**Oops**`,
                value: `Looks like the servers are empty :c`
            });
        }

        embed.setTitle(`Players online: ${onlineCount}`);
        embed.setDescription(`Servers online: ${serverCount}`);

        return online.reply({
            embeds: [embed]
        });
    },
};