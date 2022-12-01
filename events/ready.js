const {
    EmbedBuilder
} = require('discord.js');

const {
    chatchannelid, botLogo
} = require("../config.json");
const logger = require('../modules/logger');


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const embed = new EmbedBuilder()
            .setTitle('Bot Online')
            .setColor(0x00FFFF);

        logger.info(`Ready! Logged in as ${client.user.tag}`);
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
                logger.info(`No webhooks were found so I made one!`);
            }

            /*await webhook.send({
                username: client.username,
                avatarURL: botLogo,
                embeds: [embed],
            });*/
        } catch (error) {
            logger.error('Error trying to send: ', error);
        }

    },
};