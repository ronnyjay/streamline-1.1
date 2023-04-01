const { getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");
const GuildIndex = require("../resources/GuildIndex");
const embeds = require('../util/embeds');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Display the currently playing track'),
    
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

        if (GuildPlayer.AudioPlayer.state.status === AudioPlayerStatus.Idle) {
            await interaction.editReply({ embeds: [embeds.offline] });
            return;
        }

        await interaction.editReply({ embeds: [embeds.nowPlaying(GuildPlayer.nowPlaying)] });
    }
}