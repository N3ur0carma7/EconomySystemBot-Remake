const { Client } = require('discord.js');
const { CommandKit } = require('commandkit');
const mongoose = require('mongoose');
require('dotenv').config();

const client = new  Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
});

new CommandKit({
    client,
    commandsPath: `${__dirname}/commands`,
    eventsPath: `${__dirname}/events`
});
(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    client.login(process.env.TOKEN);
})();
