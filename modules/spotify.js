const youtube = require('./youtube');
const request = require('request');
const fetch = require('node-fetch');
const errors = require('../util/errors');
require('dotenv').config();

const spotifyBaseUrl = "https://api.spotify.com/v1";

let TOKEN;
let EXP_TIME;

const getAuthorizationToken = () => {
    return new Promise((resolve, reject) => {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
              'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
            },
            form: {
              grant_type: 'client_credentials'
            },
            json: true
          };

          request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                EXP_TIME = Date.now() + 3600 * 1000;
                resolve(body.access_token);
            }
        });
    })
}

function isTokenExpired() {
    return EXP_TIME < Date.now();
}

(async () => {
    TOKEN = await getAuthorizationToken();
})();

function getRequestUrl(url) {
    const id = url.split('/').pop().split('?').shift();
    
    const requestEndpoint = url.includes('/playlist/') ? 'playlists' :
        url.includes('/album/') ? 'albums' : 'tracks';
                    
    return `${spotifyBaseUrl}/${requestEndpoint}/${id}`;
}

async function getRequestResponse(requestUrl) { 
    if (isTokenExpired()) {
        TOKEN = await getAuthorizationToken();
    }

    const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + TOKEN
        },
    });

    switch (response.status) {
        case 400:
            throw errors.ERR400;
        case 401:
            throw errors.ERR401;
        case 404:
            throw errors.ERR404;
        default: 
            break;
    }

    return await response.json();
}

async function getTrackExternal(rawUrl) {
    return await getRequestResponse(getRequestUrl(rawUrl));
}

async function getPlaylistTracks(rawUrl) {
    let response = (await getRequestResponse(getRequestUrl(rawUrl))).tracks;
    let tracks = response.items.map(item => item.track);

    if (response.next) {
        do {
            response = await getRequestResponse(response.next);
            tracks = tracks.concat(response.items.map(item => item.track));
        }
        while (response.next);
    }

    return tracks;
}

async function getAlbumTracks(rawUrl) {
    let response = (await getRequestResponse(getRequestUrl(rawUrl))).tracks;
    let tracks = response.items;

    if (response.next) {
        do {
            response = await getRequestResponse(response.next);
            tracks = tracks.concat(response.items);
        }
        while (response.next);
    }

    return tracks;
}

module.exports = {
    validate: function(url) {
        return url.includes('https://open.spotify.com');
    },
    getType: function(url) {
        return url.includes('/playlist/') ? 'playlist' :
            url.includes('/album/') ? 'album' : 'track';
    },
    getTrack: async function(url) {
        const { name, artists } = await getTrackExternal(url);

        const trackTitle = name + " - " + artists[0].name;
        const trackUrl = await youtube.search(trackTitle);

        return {
            url: trackUrl,
            title: trackTitle
        }
    },
    getPlaylist: async function(url) {
        const tracks = await getPlaylistTracks(url);

        const trackObjects = tracks.map(async (track) => {
            const trackTitle = `${track.name} - ${track.artists[0].name}`;
            const trackUrl = await youtube.search(trackTitle);
            return {
                title: trackTitle,
                url: trackUrl
            };
        });

        return await Promise.all(trackObjects);
    },
    getAlbum: async function(url) {
        const tracks = await getAlbumTracks(url);

        const trackObjects = tracks.map(async (track) => {
            const trackTitle = `${track.name} - ${track.artists[0].name}`;
            const trackUrl = await youtube.search(trackTitle);
            return {
                title: trackTitle,
                url: trackUrl
            };
        });

        return await Promise.all(trackObjects);
    }
}