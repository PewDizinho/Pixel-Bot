const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const PixelEmbed = require('../util/embed.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('testing')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        var embed = new PixelEmbed("Cool Title", "Cool Description", "pixel_community", null, null, null, null, true).embed;
        interaction.reply({ content: "y", embeds: [embed] });
    }
}
