# Streamline-1.1

Streamline is a feature-rich discord bot that currently supports YouTube, Spotify, and SoundCloud. For more information regarding Streamline and the use of its commands, please refer to the following guide:

## Commands

### Play
	/play [song name / video link]

### Clear 
Removes all the songs that are currently in the queue.

	/clear

### Help
Displays a list of available commands for the bot.

	/help

### Now Playing
Displays information about the currently playing song.

	/nowplaying

### Pause
Pause or Unpause the currently playing song.

	/pause

### Play Next
Add a track or playlist to the front of the queue. The queued track/tracks will be played next after the current song finishes.

	/playnext [song name / video link]

### Queue
Displays a list of all the songs that are currently in the queue.

	/queue

### Remove
Remove a specific song from the queue by providing its track number.

	/remove [track number]

### Shuffle
Shuffle the order of the queue.

	/shuffle

### Skip
Skip to a specific song in the queue by providing its track number. If no track number is specified, skips currently playing song.

	/skip [track number]

### Stop
Stops the bot and removes all songs from the queue.

	/stop
	
## Setting up Streamline

Install the required node packages

	npm update
	
Create a .env file in the root directory of your project and format it like the example below:

	TOKEN="Your Discord Token"
	CLIENT_ID="Your spotify client id"
	CLIENT_SECRET="Your spotify client secret"
	
Start the bot

	node .
	
## Invite Streamline to your server

	https://discord.com/api/oauth2/authorize?client_id=1051004805193142282&permissions=32&scope=bot%20applications.commands

Invite the official release of Streamline to your discord server and enjoy the following benefits:
+ Reduced setup time
+ 24/7 Uptime
+ Automatically deployed maintenance and updates
+ Lower cost
+ Community

	
## Join the official Streamline server
	
	https://discord.gg/mcJeYUX2CA

