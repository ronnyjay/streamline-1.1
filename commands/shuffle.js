const { getVoiceConnection } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");
const GuildIndex = require("../resources/GuildIndex");
const embeds = require('../util/embeds');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle the queue'),
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

        for (let i = GuildPlayer.queue.length - 1; i > 0; i--) {
            let rand = Math.floor(Math.random() * (i + 1));
            let tempQueue = GuildPlayer.queue[i];
            GuildPlayer.queue[i] = GuildPlayer.queue[rand];
            GuildPlayer.queue[rand] = tempQueue;
        }

        await interaction.editReply({ embeds: [embeds.shuffled] });
    }
}