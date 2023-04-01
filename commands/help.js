const { SlashCommandBuilder } = require("discord.js");
const embeds = require('../util/embeds');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('More information regarding streamline'),

    async execute(interaction) {
        await interaction.editReply({ embeds: [embeds.help] });
    }
}