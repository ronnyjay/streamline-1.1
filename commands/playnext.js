const { getVoiceConnection, joinVoiceChannel, AudioPlayerStatus } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");
const Connnection = require("../resources/Connection");
const GuildIndex = require("../resources/GuildIndex");
const parser = require('../modules/parser')
const embeds = require('../util/embeds');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('playnext')
    .setDescription('Queue track to be played next')
    .addStringOption(option => 
        option
        .setName('url')
        .setDescription('Url or Search Query')
        .setRequired(true)),
    async execute(interaction) {
        let GuildPlayer = GuildIndex.getGuildPlayer(interaction.guild.id);
        let trackData = await parser.getTrackData(interaction.options.getString('url'));

        if (!trackData) {
            await interaction.editReply({ embeds: [embeds.invalidURL] });
            return;
        }

        let connection;

        const audioPlayerState = GuildPlayer.AudioPlayer.state.status;

        if (audioPlayerState === AudioPlayerStatus.Idle) {
            connection = new Connnection(interaction).subscribe(GuildPlayer);

            if (Array.isArray(trackData)) {
                const size = trackData.length;

                GuildPlayer.queue.push(...trackData.slice(1));
                trackData = trackData.shift();

                await interaction.editReply({embeds: [embeds.nowPlayingPlaylist(trackData.title, size)] });
            }
            else {
                await interaction.editReply({ embeds: [embeds.nowPlaying(trackData.title)] });
            }
            GuildPlayer.play(trackData.url);
            GuildPlayer.nowPlaying = trackData.title;
        }
        else if (audioPlayerState === AudioPlayerStatus.Playing) {
            connection = getVoiceConnection(interaction.guild.id);

            if (interaction.member.voice.channelId !== connection.joinConfig.channelId) {
                await interaction.editReply({ embeds: [embeds.notInChannel] });
                return;
            }

            if (Array.isArray(trackData)) {
                GuildPlayer.queue.unshift(...trackData);
                await interaction.editReply({ embeds: [embeds.playingNext(trackData[0].title, trackData.length)] });
            } 
            else {
                GuildPlayer.queue.unshift(trackData);
                await interaction.editReply({ embeds: [embeds.playingNext(trackData.title, 1)] });
            }
        }
    }
}