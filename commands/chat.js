const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Crie um chat com outro membro de forma anônima!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => option.setName('target').setDescription('The user').setRequired(true))


    ,
    async execute(interaction) {
        const categoryId = '1054100659718340649';
        interaction.guild.channels.create({
            name: `${interaction.options.getUser('target').discriminator}-${interaction.user.discriminator}`,
            type: ChannelType.GuildText,
            parent: categoryId,
            topic: `${interaction.user.discriminator}-${interaction.options.getUser('target').discriminator}`,

            permissionOverwrites: [
                {
                    id: '830555222752362498',
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.options.getUser('target').id,
                    allow: [PermissionFlagsBits.ViewChannel],
                },
            ],
        });
        //
        interaction.guild.channels.create({
            name: `${interaction.user.discriminator}-${interaction.options.getUser('target').discriminator}`,
            type: ChannelType.GuildText,
            parent: categoryId,
            topic: `${interaction.options.getUser('target').discriminator}-${interaction.user.discriminator}`,
            permissionOverwrites: [
                {
                    id: '830555222752362498',
                    deny: [PermissionFlagsBits.ViewChannel],
                }, {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel],
                },
            ],
        });
    }
}