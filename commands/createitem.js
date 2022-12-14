const { Message, SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, Discord, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createitem')
        .setDescription('Crie um item!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Pixel Store')
            .setThumbnail('https://media.discordapp.net/attachments/1052329282069872650/1052329370305450115/Pixel_Store.png?width=675&height=675')
            .setDescription('Enquanto nosso site não fica pronto, você pode realizar vendas pelo nosso discord!\n\n❗❗ **Atenção! Leia nosso [Termo de uso](https://discord.com/channels/830555222752362498/1052673481373917324) antes de utilizar esse comando!**❗❗\n\n ');

        await interaction.reply({ content: '', ephemeral: true, embeds: [embed] });

    }
}