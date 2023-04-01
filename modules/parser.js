const ytdl = require('ytdl-core');
const youtube = require('./youtube');
const spotify = require('./spotify');
const soundcloud = require('./soundcloud');

const LinkType = {
    YouTube: 'youtube',
    Spotify: 'spotify',
    SoundCloud: 'soundcloud',
    Search: 'search',
    Invalid: 'invalid'
}

const TrackType = {
    Track: 'track',
    Album: 'album',
    Playlist: 'playlist',
}

function getLinkType(url) {
    if (ytdl.validateURL(url)) {
        return LinkType.YouTube;
    }
    else if (spotify.validate(url)) {
        return LinkType.Spotify;
    } 
    else if (soundcloud.validate(url)) {
        return LinkType.SoundCloud;
    }
    else if (['com', '.net', '.tv', '.org'].some(ext => url.includes(ext))) {
        return LinkType.Invalid;
    } 
    else {
        return LinkType.Search;
    }
}

module.exports = {
    getTrackData: async function(url) {
        var trackData;

        switch(getLinkType(url)) {
            case LinkType.YouTube: 
                trackData = await youtube.getTrack(url);
                break;
            case LinkType.Spotify:
                switch (spotify.getType(url)) {
                    case TrackType.Playlist:
                        trackData = await spotify.getPlaylist(url);
                        break;
                    case TrackType.Album:
                        trackData = await spotify.getAlbum(url);
                        break;
                    default:
                        trackData = await spotify.getTrack(url);
                        break;
                }
                break;
            case LinkType.SoundCloud: 
                if (soundcloud.isShortenedUrl(url)) {
                    url = await soundcloud.getExtendedUrl(url);
                }
                switch (soundcloud.getType(url)) {
                    case TrackType.Playlist:
                        trackData = await soundcloud.getPlaylist(url);
                        break;
                    default:
                        trackData = await soundcloud.getTrack(url);
                        break;
                }
                break;
            case LinkType.Search:
                trackData = await youtube.getTrackSearch(url);
                break;
            default: 
                return undefined;
        }

        return trackData;
    }
}