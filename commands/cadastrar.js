const { SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, CommandInteractionOptionResolver } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cadastrar')
        .setDescription('Se cadastre!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('cadastro_vendedor')
            .setTitle('Cadastrar Vendedor');
        const nick = new TextInputBuilder()
            .setCustomId('nick')
            .setLabel("Defina um NickName para você usar!")
            .setPlaceholder('Nicks não devem fazem referência ao seu nick verdadeiro, nicks estão sujeitos a verificação.')
            .setStyle(TextInputStyle.Short);

        const description = new TextInputBuilder()
            .setCustomId('description')
            .setLabel('Uma breve descrição do seu trabalho')
            .setPlaceholder('Faça uma descrição de sua experiência e o que sabe fazer. Descrições estão sujeitas a verificações')
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(nick);
        const secondActionRow = new ActionRowBuilder().addComponents(description);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);

        // Show the modal to the user
    

        await interaction.showModal(modal);
    }
}