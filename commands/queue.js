const { getVoiceConnection } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");
const GuildIndex = require("../resources/GuildIndex");
const embeds = require('../util/embeds');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Display the current queue'),
    async execute(interaction) {
        const GuildPlayer = GuildIndex.getGuildPlayer(interaction.guild.id);

        if (!(getVoiceConnection(interaction.guild.id))) {
            await interaction.editReply({ embeds: [embeds.offline] });
            return;
        }

        if (GuildPlayer.queue.length === 0) {
            await interaction.editReply({ embeds: [embeds.emptyQueue] }); 
            return; 
        }

        let queue = [];
        let trackNumber = 1;

        for (let trackObject of GuildPlayer.queue) {
            if (trackNumber > 25) {
                break;
            }
            queue.push(`${trackNumber}. ${trackObject.title}`);
            trackNumber++;
        }

        await interaction.editReply({ embeds: [embeds.printQueue(queue, trackNumber)] });
    }
}