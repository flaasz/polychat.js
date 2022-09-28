const {
    SlashCommandBuilder
} = require('discord.js');

const encoder = require("../modules/encoder.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("tps")
        .setDescription('Display tps of the server.')
        .setDefaultMemberPermissions(4)
        .addStringOption(option =>
            option.setName('server')
            .setDescription('Server ID')
            .setRequired(true)),
    async execute(interaction) {

        let newCommandInteraction = {
            [`[${interaction.id}]`]: {
                interaction
            }
        };


        interaction.client.commandData = Object.assign(interaction.client.commandData, newCommandInteraction);

        console.log(interaction.options.getString("server"));

        //console.log(interaction);

        let encodedCommand = {
            command: ["forge", "tps"],
            interactionId: interaction.id,
            serverId: interaction.options.getString("server").toUpperCase()
        };

        await interaction.deferReply();

        encoder.encodeCommand(interaction, encodedCommand);


    },
};