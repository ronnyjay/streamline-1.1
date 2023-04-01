const { createAudioPlayer, AudioPlayerStatus, getVoiceConnection, createAudioResource, StreamType } = require("@discordjs/voice");
const { default: scdl } = require("soundcloud-downloader");
const soundcloud = require("../modules/soundcloud");
const playdl = require('play-dl');
const time = require('../util/time');

module.exports = class GuildPlayer {
    constructor(guildId, guildName) {
        this.id = guildId;
        this.tag = guildName;
        this.AudioPlayer = createAudioPlayer();
        this.status;
        this.queue = [];
        this.nowPlaying = "";

        this.AudioPlayer.on('stateChange', async (oldState, newState) => {
            this.status = newState.status;
            if (this.status === 'idle') {
                this.#getNextTrack();
            }
            if (this.status === 'paused') {
                setTimeout(() => {
                    this.destroyIfInactive();
                }, 540000);
            }
        });

        this.AudioPlayer.on('error', async (error) => {
            console.error(error);
        });
    }

    play(url) {
        this.createPlaystream(url).then(stream => {
            this.AudioPlayer.play(stream);
        });
    }

    #getNextTrack() {
        const track = this.queue.shift();

        if (track) {
            this.play(track.url);
            this.nowPlaying = track.title;
            return;
        }

        this.destroyIfInactive();
    }

    destroyIfInactive() {
        setTimeout(() => {
            const connection = getVoiceConnection(this.id);

            if (!connection) {
                return;
            }

            if (!(this.status === 'idle') && !(this.status === 'paused')) {
                return;
            }
            
            connection.destroy();
        
            this.queue.length = 0;
            this.nowPlaying = '';

            console.log(`${time.getTime()}: Terminating Audio Player for '${this.tag}'`);
        }, 60000);
    }

    async createPlaystream(url) {
        if (soundcloud.validate(url)) {
            const stream = await scdl.download(url);

            return createAudioResource(
                stream, {
                    inputType: StreamType.Arbitrary
            });
        }

        const { stream, type } = await playdl.stream(url);

        return createAudioResource(
        stream, {
            inputType: type
        });  
    }
}