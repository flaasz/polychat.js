const {
    EmbedBuilder
} = require('discord.js');

const { chatchannelid } = require("../config.json");


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const embed = new EmbedBuilder()
            .setTitle('Some Title')
            .setColor(0x00FFFF);

        console.log(`Ready! Logged in as ${client.user.tag}`);
        const channel = client.channels.cache.get(chatchannelid);
        try {
            const webhooks = await channel.fetchWebhooks();
            const webhook = webhooks.find(wh => wh.token);

            if (!webhook) {
                return console.log('No webhook was found that I can use!');
            }

            await webhook.send({
                content: 'Webhook test',
                username: 'some-username',
                avatarURL: 'https://i.imgur.com/AfFp7pu.png',
                embeds: [embed],
            });
        } catch (error) {
            console.error('Error trying to send: ', error);
        }

    },
};