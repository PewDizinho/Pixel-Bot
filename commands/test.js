const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const PixelEmbed = require('../util/embed.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('testing')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        interaction.reply({
            content: "y", embeds: [
                new PixelEmbed(
                    {
                        author: "Cool Title",
                        description: "Cool Description",
                        image: "pixel_community",
              
                    }).embed
            ]
        });
    }
}
