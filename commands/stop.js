const { getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");
const GuildIndex = require("../resources/GuildIndex");
const embeds = require('../util/embeds');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop audio playback'),
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

        connection.destroy();

        GuildPlayer.AudioPlayer.state.status = AudioPlayerStatus.Idle;
        GuildPlayer.queue.length = 0;
        GuildPlayer.nowPlaying = '';

        await interaction.editReply({ embeds: [embeds.stop] });
    }
}