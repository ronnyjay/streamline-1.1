const ytdl = require('ytdl-core-discord');
const fetch = require('node-fetch');

const requestUrl = 'https://www.youtube.com/results?search_query=';
const returnUrl = 'https://www.youtube.com/watch?v=';

const regex = /"videoId":"([^"]+)"/;

module.exports = {
    getTrack: async function(rawUrl) {
        const info = await ytdl.getInfo(rawUrl);

        return {
            title: info.videoDetails.title,
            url: info.videoDetails.video_url
        }
    },
    getTrackSearch: async function(query) {
        const trackUrl = await this.search(query);
        const trackTitle = (await ytdl.getBasicInfo(trackUrl)).videoDetails.title;
        return {
                title: trackTitle,
                url: trackUrl
        }
     },
    search: async function(query) {
        const response = await fetch(requestUrl + query);
        const html = await response.text();
        const video = html.match(regex);
        if (video) {
            return returnUrl + video[1];
        }
    },
}