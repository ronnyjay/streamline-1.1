const { Client, Events, GatewayIntentBits, Collection, ActivityType, NewsChannel } = require('discord.js');
const GuildIndex = require('./resources/GuildIndex');
const embeds = require('./util/embeds');
const time = require('./util/time');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

// Create a new client and guildIndex instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async c => {
	console.log(`${time.getTime()}: Logged in as ${c.user.tag}`);

    GuildIndex.initialize(client.guilds.cache);

    client.user.setActivity('/help', { type: ActivityType.Listening });
});

client.on('guildCreate', (guild) => {
    GuildIndex.addGuild(guild.id);
});

// Listen for & Handle interactions
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    console.log(`${time.getTime()}: ${interaction.user.tag} issued '/${interaction.commandName}'`);

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
		return;
    }

    if (!interaction.member.voice.channel && interaction.commandName !== 'help') {
        await interaction.reply({ embeds: [embeds.inactiveConnection], ephemeral: true });
        return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
        await command.execute(interaction);
    } 
    catch (error)  {
        if (error.status === 400) {
            await interaction.editReply({ embeds: [embeds.ERR400] });
        }
        else if (error.status === 404) {
            await interaction.editReply({ embeds: [embeds.ERR404] });
        }
        else {
            await interaction.editReply({ embeds: [embeds.unknownError] });
        }
        console.error(error);
    }

});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const guildPlayer = GuildIndex.getGuildPlayer(oldState.guild.id);

    // Ignore voiceStateUpdates caused by the bot
    if (oldState?.member.bot || newState?.member.bot) {
        return;
    }

    // User moved into channel
    if (oldState.channelId === null && newState.channelId !== null) {
        if (newState.channel.members.size === 2 && newState.channel.members.has(client.user.id)) {
            guildPlayer.AudioPlayer.unpause();
        }
    }

    // User left channel and one remains
    if (newState.channelId === null && oldState.channel.members.size === 1) {
        if (oldState.channel.members.has(client.user.id)) {
            guildPlayer.AudioPlayer.pause();
            guildPlayer.destroyIfInactive();
        }
    }

    // User moved channels
    if (oldState.channelId !== null && newState.channelId !== null) {
        if (newState.channel.members.size === 2 && newState.channel.members.has(client.user.id)) {
            guildPlayer.AudioPlayer.unpause();
        }
        if (oldState.channel.members.size === 1 && oldState.channel.members.has(client.user.id)) {
            guildPlayer.AudioPlayer.pause();
            guildPlayer.destroyIfInactive();
        }   
    }
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);