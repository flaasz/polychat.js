const encoder = require("../modules/encoder.js");

const {
    chatchannelid
} = require('../config.json');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        try {

            if (message.author.bot) return;
            if (message.channel != chatchannelid) return;
            //console.log(message);

            let processedMessage = `§9[Discord] §r${message.author.username}: ${message.content}`;

            if (message.mentions.repliedUser) {
                processedMessage = `§9[Discord] §r${message.author.username} §7(reply to ${message.mentions.repliedUser.username}): §r${message.content}`;
            }

            message.mentions.users.forEach(u => {
                let filter = new RegExp(`<@${u.id}>`, "g");
                processedMessage = processedMessage.replace(filter, `@${u.username}`);
            });

            message.attachments.forEach(a => {
                processedMessage = processedMessage + " [Attachment]";
            });

            encoder.encodeMessage(message.client.serverData, processedMessage);
            console.log(processedMessage.replace(/§+[\w]/g, ''));

        } catch (error) {
            console.error('Error: ', error);
        }

    },
};