const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const MP = require("../util/mercadopago.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createpix')
        .setDescription('Crie um QR code para pagar via PIX')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addNumberOption(option =>
            option.setName('valor')
                .setDescription('O valor que você quer enviar!')
                .setRequired(true),
        ),

    async execute(interaction) {
        MP.comprar(interaction,
            {
                username: interaction.user.tag,
                id: interaction.user.id,
                email: `${interaction.user.username}@gmail.com`
            },
            {
                name: "Plugin Teste - Pixel",
                price: interaction.options.getNumber("valor")
            });

    }
}
