const { getVoiceConnection } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");
const GuildIndex = require("../resources/GuildIndex");
const embeds = require('../util/embeds');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the currently playing song')
    .addIntegerOption(option =>
        option
        .setName('to')
        .setDescription('Skip to desired song in the queue')
        .setRequired(false)),
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

        let skipTo = interaction.options.getInteger('to') - 1;

        if (skipTo === -1) {
            skipTo = 0;
        }

        if (skipTo >= GuildPlayer.queue.length) {
            skipTo = GuildPlayer.queue.length - 1;
        }

        for (let i = 0; i < skipTo; i++) {
            GuildPlayer.queue.shift();
        }

        let track = GuildPlayer.queue.shift();

        GuildPlayer.play(track.url);
        GuildPlayer.nowPlaying = track.title;

        await interaction.editReply({ embeds: [embeds.nowPlaying(track.title)] });
    }
}