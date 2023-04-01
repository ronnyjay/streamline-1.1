const { getVoiceConnection } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");
const GuildIndex = require('../resources/GuildIndex');
const embeds = require('../util/embeds');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a track from the queue')
    .addIntegerOption(option => 
        option
        .setName('index')
        .setDescription('Position of track')
        .setRequired(true)),
    async execute(interaction) {
        const GuildPlayer = GuildIndex.getGuildPlayer(interaction.guild.id);
        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            await interaction.editReply({ embeds: [embeds.offline] });
            return;
        }

        if (interaction.member.voice.channelId !== connection.joinConfig.channelId) {
            await interaction.editReply({ embeds: [embeds.notInChannel] });
            return;
        }

        if (GuildPlayer.queue.length === 0) {
            await interaction.editReply({ embeds: [embeds.emptyQueue] });
            return;
        }

        let index = interaction.options.getInteger('index') - 1;

        if (index === -1 || index >= GuildPlayer.queue.length) {
            await interaction.editReply({ embeds: [embeds.invalidIndex] });
            return;
        }

        GuildPlayer.queue.splice(index, 1);
    
        await interaction.editReply({ embeds: [embeds.removedTrack(
            GuildPlayer.metadata.splice(index, 1)[0])] });
    }
}