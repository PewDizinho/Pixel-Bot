const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const mongoose = require('mongoose');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('teste')
        .setDescription('test')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const kittySchema = new mongoose.Schema({
            name: String
        });
        const Kitten = mongoose.model('Kitten', kittySchema);
        const silence = new Kitten({ name: 'Silence' });
        console.log(silence.name); // 'Silence'
    }
}
