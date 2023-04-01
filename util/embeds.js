const { EmbedBuilder } = require("@discordjs/builders");
const { Embed } = require("discord.js");

const baseCommands = [
    '`/play => play a song`',
    '`/playnext => queue a song to be played next`',
    '`/pause => pause or unpause the player`',
    '`/skip => skip the current song`',
    "`/remove => remove a song from the queue`",
    '`/shuffle => shuffle the queue`',
    '`/stop => stop the player`',
    '`/queue => display the current queue`',
    '`/clear => clear the current queue`',
    '`/nowplaying => display the song currently playing`',
];

const responsesInfo = "Streamline uses `ephemeral` responses, therefore only the user initiating a command will see the response. Commands such as `/nowplaying` are helpful if you would like to see the song that is currently playing.";

module.exports = {
    unknownError: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('An unexpected error occurred while attempting to execute this command.'),
    inactiveConnection: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('You must be in a voice channel to use this command.'),
    invalidURL: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('The url you have provided is invalid.'),
    nowPlaying: function(songTitle) {
        return new EmbedBuilder()
        .setColor(0x000000)
        .setTitle('Streamline:')
        .setDescription('Now Playing: ' + songTitle);
    },
    nowPlayingPlaylist: function (songTitle, size) {
        return new EmbedBuilder()
        .setColor(0x000000)
        .setTitle('Streamline:')
        .setDescription(`Now Playing: ${songTitle} + ${size - 1} others`);
    },
    addedToQueue: function (songTitle) {
        return new EmbedBuilder()
        .setColor(0x000000)
        .setTitle('Streamline')
        .setDescription(`Added to queue: ${songTitle}`)
    },
    playlistToQueue: function(songTitle, size) {
        return new EmbedBuilder()
        .setColor(0x000000)
        .setTitle('Streamline:')
        .setDescription(`Added to queue: ${songTitle} + ${size - 1} others`)
    },
    playingNext: function (songTitle, size) {
        const embed = new EmbedBuilder()
        .setColor(0x000000)
        .setTitle('Streamline:')

        if (size > 1) {
            return embed.setDescription(`Playing next: ${songTitle} + ${size - 1} others`)
        }

        return embed.setDescription(`Playing next: ${songTitle}`)
    },
    stop: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('Streamline has been stopped'),
    offline: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('Streamline is currently inactive.'),
    notInChannel: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('You must be in the same voice channel as streamline to use this command.'),
    emptyQueue: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('Queue is empty...'),
    printQueue: function(metadata, trackCount) {
        const embed = new EmbedBuilder()
        .setColor(0x000000)
        .setDescription(metadata.join('\n'));

        if (trackCount > 25) {
            return embed.setTitle('Streamline Queue (First 25):')
        }
        
        return embed.setTitle('Streamline Queue:')
    },
    paused: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('Streamline has been paused'),
    unpaused: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('Streamline has resumed playback'),
    invalidIndex: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('The index you provided is invalid and cannot be removed from the queue.'),
    removedTrack: function(songTitle) {
        return new EmbedBuilder()
        .setColor(0x000000)
        .setTitle('Streamline:')
        .setDescription(`Removed from queue: ${songTitle}`)
    }, 
    shuffled: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('Queue has been shuffled successfully'),
    cleared: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('Queue has been cleared successfully'),
    help: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('Streamline is a feature-rich discord bot that currently supports YouTube, Spotify, and SoundCloud. For more information regarding Streamline and the use of its commands, please refer to the following guide:')
    .addFields({ name: "Commands:", value: baseCommands.join("\n"), inline: true })
    .addFields({ name: "Reponses:", value: responsesInfo, inline: false }),
    ERR400: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('Streamline was unable to process your request as the URL provided is not formatted correctly. Please check that the URL is correct and try again.'),
    ERR404: new EmbedBuilder()
    .setColor(0x000000)
    .setTitle('Streamline:')
    .setDescription('The content you requested was not found. It may be private or no longer available.')
}