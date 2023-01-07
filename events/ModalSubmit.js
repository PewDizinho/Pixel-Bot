
const PixelEmbed = require("../util/embed.js");
const { ActionRowBuilder, ButtonBuilder} = require('discord.js');
module.exports = {
    async export(interaction) {
        switch (interaction.customId) {
            case 'cadastro_vendedor':
                var embed = new PixelEmbed({ author: interaction.user.id.toString(), description: 'ID: \`\`\` ' + interaction.user.id + '\`\`\`\n\n' + 'Username \`\`\` ' + interaction.user.tag + '\`\`\`\n\nNick \`\`\`' + interaction.fields.getTextInputValue("nick") + '\`\`\`\n\nDescrição\`\`\`' + interaction.fields.getTextInputValue("description") + '\`\`\`\n\nChave PIX\`\`\`' + interaction.fields.getTextInputValue("pix") + '\`\`\`\n\nConcordou com TOS\`\`\`' + interaction.fields.getTextInputValue("tos") + '\`\`\`\n', title: 'Cadastro Vendedor' }).embed

                var row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('vendedor_submit_aceitar')
                            .setLabel('Aceitar')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('vendedor_submit_negar')
                            .setLabel('Negar')
                            .setStyle(ButtonStyle.Danger)
                    );
                interaction.reply({ content: "Sua solicitação foi enviada para nossa equipe da staff! Irei te avisar na DM quando ela for aceita.", ephemeral: true });
                interaction.client.channels.cache.find(channel => channel.id == channelsId.verification.vendedores).send({ embeds: [embed], components: [row] });//.then(msg => { msg.react("✅"); msg.react("❎"); msg.react("🔰"); });
                break;
            case 'item_submit':
                var row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('item_submit_aceitar')
                            .setLabel('Aceitar')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('item_submit_negar')
                            .setLabel('Negar')
                            .setStyle(ButtonStyle.Danger)
                    );

                interaction.reply({ content: "Sua solicitação foi enviada para nossa equipe da staff! Irei te avisar na DM quando um membro da nossa equipe.", ephemeral: true });
                interaction.client.channels.cache.find(channel => channel.id == channelsId.verification.items).send({
                    embeds: [
                        new PixelEmbed({ author: interaction.client.id, description: 'Username \`\`\`' + interaction.user.tag + '\`\`\`\n\nNome do Item \`\`\`' + interaction.fields.getTextInputValue("nome") + '\`\`\`\n\nPreço\`\`\`' + interaction.fields.getTextInputValue("price") + '\`\`\`\n ' + '\nDescrição\`\`\`' + interaction.fields.getTextInputValue("description") + '\`\`\`\n' + `\n[Link](${interaction.fields.getTextInputValue("file_URL")})\`\`\`` + interaction.fields.getTextInputValue("file_URL") + '\`\`\`\n ' + '\nTipo de item\`\`\`' + interaction.fields.getTextInputValue("itemType") + '\`\`\`\n ' }).embed], components: [row]
                });

                break;
            case 'verification_deny_reason':

                interaction.client.guilds.cache.get(interaction.message.guildId).channels.cache.get(channelsId.auditoria.vendedores).send({ content: `Negado por: ${interaction.user.tag} - \`${interaction.user.id}\` motivo: \`${interaction.fields.getTextInputValue("reason")}\``, embeds: (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds })

                await interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get((await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0].author.name).send({ content: '', embeds: [new PixelEmbed({ author: "Solicitação NEGADA", description: `Olá! Venho informar que sua solicitação para **vendedor** foi **negada** por ${interaction.user.tag} - \`${interaction.user.id}\` motivo: \`${interaction.fields.getTextInputValue("reason")}\`` }).embed] });
                interaction.message.delete();
                interaction.reply({ content: "Solicitação negada! Sua mensagem foi enviada para o membro e foi salva na minha DataBaseSellers!", ephemeral: true });
                break;
        }
    }
}