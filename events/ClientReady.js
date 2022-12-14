const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.clear();
        console.log(`Estou online como *${client.user.tag}*! Tenha um dia PixelizaLindo!`);
    },
};