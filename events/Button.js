
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const DataBaseSellers = require("../database/models/vendedores.js");
const { channelsId, rolesId } = require("../config.json");

module.exports = {
    async execute(interaction) {
        switch (interaction.customId) {
            case 'vendedor_submit_aceitar':
                const embed = (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0];
                const memberObject = interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get(embed.author.name);
                const embedInfo = embed.description.replace("+", ',').split("\n")

                const seller = new DataBaseSellers({
                    userId: memberObject.id,
                    username: memberObject.username,
                    userDescriminator: memberObject.discriminator,
                    info: {
                        fakeNick: embedInfo[4].split("`")[3],
                        description: embedInfo[6].split("`")[3],
                        type: [false, false, false, false, false, false],
                        verificatorId: interaction.user.id
                    },
                    pix: embedInfo[8].split("`")[3] + "1",

                });
                seller.create();

                break;
            case 'vendedor_submit_negar':

                const modal = new ModalBuilder()
                    .setCustomId('verification_deny_reason')
                    .setTitle('Negar Pedido de Verificação');

                modal.addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('reason')
                            .setLabel('Motivo')
                            .setPlaceholder('Esse motivo será enviado para o membro')
                            .setStyle(TextInputStyle.Paragraph)

                    ),
                    new ActionRowBuilder().addComponents(new TextInputBuilder()
                        .setCustomId('improvement')
                        .setLabel('Sugestão de melhora')
                        .setPlaceholder('Ex: "Não utilize seu nome verdadeiro para a verificação')
                        .setStyle(TextInputStyle.Paragraph))
                );
                interaction.showModal(modal);
                break;

            case ' item_submit_aceitar':

                break;
            case ' item_submit_negar':

                break;


        }
    }

}