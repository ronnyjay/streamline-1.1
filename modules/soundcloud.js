const scdl = require('soundcloud-downloader').default;
const fetch = require('node-fetch');
const errors = require('../util/errors');

module.exports = {
    validate: function(url) {
        return (this.isShortenedUrl(url) || url.includes('https://soundcloud.com')) 
    },
    getType: function(url) {
        return scdl.isPlaylistURL(url) ? 'playlist' : 'track';
    },
    isShortenedUrl: function(rawUrl) {
        return rawUrl.includes('https://on.soundcloud.com');
    },
    getExtendedUrl: async function(shortenedUrl) {
        try {
            return (await fetch(shortenedUrl)).url;
        }
        catch {
            throw errors.ERR400;
        }
    },
    /**
     * 
     * @param {String} url 
     * @returns {trackObjects} - Array of trackObjects
     * @throws {404} - Private or Invalid link
     */
    getTrack: async function(url) {
        let trackTitle; 

        try {
            trackTitle = (await scdl.getInfo(url)).title;
        }
        catch {
            throw errors.ERR404;
        }

        return {
            title: trackTitle,
            url: url
        }
    },
    getPlaylist: async function(url) {
        let tracks;

        try {
            tracks = (await scdl.getSetInfo(url)).tracks;
        }
        catch (err) {
            throw errors.ERR404;
        }

        const trackObjects = tracks.map(async (track) => {
            const trackTitle = `${track.title} - ${track.user.username}`;
            const trackUrl = track.permalink_url;
            return {
                title: trackTitle,
                url: trackUrl
            };
        });

        return await Promise.all(trackObjects);
    }
}