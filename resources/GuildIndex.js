const GuildPlayer = require("./GuildPlayer");
const time = require('../util/time');

module.exports = {
    guildIndex: [],

    initialize: function(cache) {
        cache.forEach(guild => {
            this.guildIndex.push(new GuildPlayer(guild.id, guild.name));
        });
        console.log(`${time.getTime()}: Guild Audio Players Initialized`);
    },

    getGuildPlayer: function(guildId) {
        return this.guildIndex.find(guild => guild.id === guildId);
    },

    addGuild: function(guildId) {
        this.guildIndex.push(new GuildPlayer(guildId));

        console.log(`${time.getTime()}: Intialized Guild Player '${guildId}'`);
    }
}