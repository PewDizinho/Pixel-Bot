const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, CommandInteractionOptionResolver } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cadastrar')
        .setDescription('Se cadastre!')
     .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        ,
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
            .setStyle(TextInputStyle.Paragraph);

        modal.addComponents(new ActionRowBuilder().addComponents(nick), new ActionRowBuilder().addComponents(description));
        await interaction.showModal(modal);
    }
}