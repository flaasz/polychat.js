const {
    EmbedBuilder
} = require('discord.js');

const {
    chatchannelid, botLogo
} = require("../config.json");


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const embed = new EmbedBuilder()
            .setTitle('Bot Online')
            .setColor(0x00FFFF);

        console.log(`Ready! Logged in as ${client.user.tag}`);
        const channel = client.channels.cache.get(chatchannelid);
        try {
            const webhooks = await channel.fetchWebhooks();
            var webhook = webhooks.find(wh => wh.token);

            if (!webhook) {
                webhook = await channel.createWebhook({
                        name: 'Chat Relay',
                        avatar: botLogo,
                    })
                    .catch(console.error);
                console.log(`No webhooks were found so I made one!`);
            }

            await webhook.send({
                username: client.username,
                avatarURL: botLogo,
                embeds: [embed],
            });
        } catch (error) {
            console.error('Error trying to send: ', error);
        }

    },
};