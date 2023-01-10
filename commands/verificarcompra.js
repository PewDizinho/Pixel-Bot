const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const MP = require("../util/mercadopago.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verificarcompra')
        .setDescription('Verifique o status da sua compra!')
     //  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addNumberOption(option =>
            option.setName('id')
                .setDescription('O ID da transação (normalmente encontrado no título do embed do pagamento)')
                .setRequired(true))
    ,

    async execute(interaction) {
        MP.verificarCompra(interaction, interaction.options.getNumber("id"));
    }
}
