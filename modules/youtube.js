const ytdl = require("ytdl-core-discord");
const yt = require('youtube-search-without-api-key');

module.exports = {
  getTrack: async function (rawUrl) {
    const info = await ytdl.getInfo(rawUrl);

    return {
      title: info.videoDetails.title,
      url: info.videoDetails.video_url,
    };
  },
  getTrackSearch: async function (query) {
    const trackUrl = await this.search(query);
    const trackTitle = (await ytdl.getBasicInfo(trackUrl)).videoDetails.title;
    return {
      title: trackTitle,
      url: trackUrl,
    };
  },
  search: async function (query) {
    const response = (await yt.search(query))[0];
    if (response) {
      return response.url;
    }
  },
};
