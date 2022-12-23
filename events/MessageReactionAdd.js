
const { Events, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { channelsId } = require('../config.json');
module.exports = {
    name: Events.MessageReactionAdd,
    once: false,
    async execute(reaction, user, client) {
        if (user.bot) return;
        //   if (!reaction.partial) return;
        if (reaction.message.channel.parentId != channelsId.verification.parent) return;
        switch (reaction.emoji.name) {
            case '❎':
                client.guilds.cache.get(reaction.message.guildId).channels.cache.get(channelsId.auditoria.vendedores).send({ content: `Negado por: ${user.username}#${user.discriminator} - \`${user.id}\``, embeds: (await reaction.message.channel.messages.fetch(reaction.message.id)).embeds })
                client.guilds.cache.get(reaction.message.guildId).members.cache.get((await reaction.message.channel.messages.fetch(reaction.message.id)).embeds[0].author.name).send(`Olá! Venho informar que sua solicitação para **vendedor** foi **negada** por ${user.username}#${user.discriminator} - \`${user.id}\``);
                const modal = new ModalBuilder()
                    .setCustomId('verification_deny_reason')
                    .setTitle('Negar Pedido de Verificação');

                modal.addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('reason')
                            .setLabel('Motivo')
                            .setPlaceholder('Qual o motivo para você negar esse pedido? (Esse motivo será enviado para o membro)')
                            .setStyle(TextInputStyle.Paragraph),
                    )
                );
                        user.showModal(modal);

               // reaction.message.delete(`Negado por: ${user.username}`);
                break;
            case '✅':
                console.log("Confirmar");
                break;
            case '🔰':
                console.log("Editar");
                break;
        }
    },
};