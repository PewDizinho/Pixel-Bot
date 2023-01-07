const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cadastrar')
        .setDescription('Se cadastre!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('cadastro_vendedor')
            .setTitle('Cadastro Vendedor');
        const nick = new TextInputBuilder()
            .setCustomId('nick')
            .setLabel("Defina um NickName para você usar!")
            .setPlaceholder('Nicks não devem fazem referência ao seu nick verdadeiro, nicks estão sujeitos a verificação.')
            .setStyle(TextInputStyle.Short);
        const description = new TextInputBuilder()
            .setCustomId('description')
            .setLabel('Uma breve descrição do seu trabalho')
            .setPlaceholder('Faça uma descrição de sua experiência e o que sabe fazer. Descrições estão sujeitas a verificações')
            .setStyle(TextInputStyle.Paragraph)
        const pix = new TextInputBuilder()
            .setCustomId('pix')
            .setLabel('Pix para o pagamento')
            .setPlaceholder('Ex: "Chave aleatória: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX"')
            .setStyle(TextInputStyle.Short)
        const tos = new TextInputBuilder()
            .setCustomId('tos')
            .setLabel("Termos de Uso")
            .setPlaceholder("Escreva \"sim\" para dizer que está de acordo com nossos Termos de Uso ")
            .setStyle(TextInputStyle.Short);
        modal.addComponents(new ActionRowBuilder().addComponents(nick), new ActionRowBuilder().addComponents(description), new ActionRowBuilder().addComponents(pix), new ActionRowBuilder().addComponents(tos));
        await interaction.showModal(modal);
    }
}