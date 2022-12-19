const { Events } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.clear();
        console.log(`Estou online como *${client.user.tag}*! Tenha um dia PixelizaLindo!`);
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb://localhost:27018/test');
    },
};