const _400 = new Error(`Bad Request to Spotify API.`);
_400.status = 400;

const _401 = new Error(`Unauthorized.`)
_401.status = 401;

const _404 = new Error(`Not found. Requested content is either private or missing.`);
_404.status = 404;

module.exports = {
    ERR400: _400,
    ERR401: _401,
    ERR404: _404
}