const {
    SlashCommandBuilder
} = require('discord.js');

const encoder = require("../modules/encoder.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("exec")
        .setDescription('Execute command on the server.')
        .setDefaultMemberPermissions(4)
        .addStringOption(option =>
            option.setName('server')
            .setDescription('Server ID')
            .setRequired(true))
        .addStringOption(command =>
            command.setName('command')
            .setDescription('Command to run')
            .setRequired(true)),
    async execute(interaction) {

        let newCommandInteraction = {
            [`[${interaction.id}]`]: {
                interaction
            }
        };


        interaction.client.commandData = Object.assign(interaction.client.commandData, newCommandInteraction);

        console.log(interaction.options.getString("server"));
        let stringifyCommand = interaction.options.getString("command").split(" ");

        //console.log(interaction);

        let encodedCommand = {
            command: stringifyCommand,
            interactionId: interaction.id,
            serverId: interaction.options.getString("server").toUpperCase()
        };

        await interaction.deferReply();

        encoder.encodeCommand(interaction, encodedCommand);


    },
};