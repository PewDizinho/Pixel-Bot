
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const DataBaseSellers = require("../database/vendedores.js");
module.exports = {
    async execute(interaction) {
        switch (interaction.customId) {
            case 'vendedor_submit_aceitar':
                const embed = (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0];
                const memberObject = interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get(embed.author.name);
                const embedInfo = embed.description.replace("+", ',').split("\n")
                await DataBaseSellers.create({
                    UserId: memberObject.id,
                    pix: embedInfo[8].split("`")[3],
                    User: {
                        username: memberObject.username,
                        userDiscriminator: memberObject.discriminator
                    },
                    Info: {
                        fakeNick: embedInfo[4].split("`")[3],
                        description: embedInfo[6].split("`")[3],
                        type: [false, false, false, false, false, false],
                        verificatorId: interaction.user.id
                    },
                    Itens: []
                });

                interaction.client.guilds.cache.get(interaction.message.guildId).channels.cache.get(channelsId.auditoria.vendedores).send({ content: `Aceito por: ${interaction.user.tag} - \`${interaction.user.id}\``, embeds: (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds })
                await interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get((await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0].author.name).send(`Olá! Venho informar que sua solicitação para **vendedor** foi **aceita** por ${interaction.user.tag} - \`${interaction.user.id}\``);
                await interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get((await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0].author.name).roles.add(interaction.client.guilds.cache.get(interaction.message.guildId).roles.cache.find(role => role.id == rolesId.verificado));
                interaction.message.delete();
                interaction.reply({ content: "Solicitação aceita! O membro foi avisado e essa solicitação foi salva na minha DataBase!", ephemeral: true });

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