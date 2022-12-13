const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.clear();

        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};