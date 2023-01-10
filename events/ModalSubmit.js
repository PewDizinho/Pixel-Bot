
const PixelEmbed = require("../util/embed.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { channelsId } = require("../config.json");
const DataBase = require("../database/models/vendedores.js");
const ItemDataBase = require("../database/models/item.js");
module.exports = {
    async execute(interaction) {
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
                    content: 'Olá staff! Para aceitar essa modificação você precisa: Testar os links e o item em questão, então aperte em "Aceitar" e envie um link DIFERENTE do link enviado contendo o item em questão, NÃO ENVIE O LINK FORNECIDO PELO VENDEDOR ele pode acabar mudando ou alterando o arquivo, dando brecha para uma quebra de segurança, o link fornecido deve conter o item junto com os videos de instalação',
                    embeds: [
                        new PixelEmbed({ author: interaction.user.id, description: 'Username \`\`\`' + interaction.user.tag + '\`\`\`\n\nNome do Item \`\`\`' + interaction.fields.getTextInputValue("nome") + '\`\`\`\n\nPreço\`\`\`' + interaction.fields.getTextInputValue("price") + '\`\`\`\n ' + '\nDescrição\`\`\`' + interaction.fields.getTextInputValue("description") + '\`\`\`\n' + `\n[Link](${interaction.fields.getTextInputValue("file_URL")})\`\`\`` + interaction.fields.getTextInputValue("file_URL") + '\`\`\`\n ' + '\nTipo de item\`\`\`' + interaction.fields.getTextInputValue("itemType") + '\`\`\`\n ' }).embed], components: [row]
                });

                break;
            case 'verification_deny_reason':

                interaction.client.guilds.cache.get(interaction.message.guildId).channels.cache.get(channelsId.auditoria.vendedores).send({ content: `Negado por: ${interaction.user.tag} - \`${interaction.user.id}\` motivo: \`${interaction.fields.getTextInputValue("reason")}\``, embeds: (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds })
                await interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get((await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0].author.name).send({
                    content: '', embeds: [
                        new PixelEmbed(
                            {
                                author: 'Solicitação NEGADA',
                                description: `Olá! Venho informar que sua solicitação para **vendedor** foi **negada** por ${interaction.user.tag} - \`${interaction.user.id}\``,
                                fields: [
                                    { name: 'Motivo', value: `\`${interaction.fields.getTextInputValue("reason")}\``, inline: true },
                                    { name: 'Sugestão de Melhora', value: `\`${interaction.fields.getTextInputValue("improvement")}\`` },
                                ]
                            }).embed
                    ]
                });
                try {
                    interaction.message.delete();
                } catch (error) {
                    console.log("ERRO MODALSUBMIT.js : " + error.toString());
                }
                interaction.reply({ content: "Solicitação negada! Sua mensagem foi enviada para o membro e foi salva na minha DataBaseSellers!", ephemeral: true });
                break;
            case 'item_submit_negar':
                var userid = interaction.fields.getTextInputValue("userid");
                var user = await interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get(userid);
                user.send({
                    content: '', embeds: [
                        new PixelEmbed({
                            author: 'Solicitação NEGADA',
                            description: 'Olá! Venho informar que sua solicitação para um novo item foi `NEGADA`',
                            fields: [
                                { name: 'Nome do Item', value: interaction.fields.getTextInputValue("itemname"), inline: false },
                                { name: 'Negado por', value: `${interaction.user.tag} - \`${interaction.user.id}\``, inline: true },
                                { name: 'Motivo', value: interaction.fields.getTextInputValue("motivo"), inline: false },
                                { name: 'TOS', value: 'Por favor, siga nosso <#1052673481373917324>!' }
                            ],
                            image: 'pixel_store'
                        }).embed
                    ]
                });

                interaction.reply({ content: "Solicitação negada! Sua mensagem foi enviada para o membro e foi salva na minha DataBaseSellers!", ephemeral: true });

                interaction.client.guilds.cache.get(interaction.message.guildId).channels.cache.get(channelsId.auditoria.items).send({
                    content: `Negada por: ${interaction.user.tag} - \`${interaction.user.id}\` Motivo: ${interaction.fields.getTextInputValue("motivo")}`,
                    embeds: (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds
                });
                try {
                    (await interaction.message.channel.messages.fetch(interaction.message.id)).delete();

                } catch (error) {
                    console.log("ERRO ModalSubmit.js 99 " + error.toString());
                }

                break;
            case 'item_submit_aceitar':
                const info = interaction.fields.getTextInputValue('info').split("|");//[ '409488966665109505', 'Name', 'Price', 'Descrição', 'Script' ]
                const isValidUrl = urlString => {
                    var urlPattern = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$', 'i');
                    return !!urlPattern.test(urlString);
                }
                const sellerDataBase = new DataBase({
                    userId: info[0],
                });
                new ItemDataBase({
                    name: info[1],
                    authorId: info[0],
                    price: info[2],
                }).addNewItem()
                const assets = interaction.fields.getTextInputValue('urlimage').split("|");
                const itemUrl = interaction.fields.getTextInputValue('urlitem');

                var row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('item_comprar')
                            .setLabel('Comprar')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('item_chat')
                            .setLabel('Abrir Chat Com Vendedor')
                            .setStyle(ButtonStyle.Primary)
                    );
                let embd = new PixelEmbed({
                    author: sellerDataBase.getSellerFakeName.toString(),
                    description: `Novo item anunciado! Para realização da compra clique em "comprar" e siga as instruções. Para realização de dúvidas SOBRE O PRODUTO clique em "abrir chat com vendedor", você irá ganhar um nick anônimo e irá conversar com o vendedor que também estará usando seu nick anônimo (${sellerDataBase.getSellerFakeName}), NÃO REPASSE INFORMAÇÕES PESSOAIS PARA O VENDEDOR, Caso o vendedor peça alguma informação ou peça para você realizar o pagamento novamente pra ele, tire prints e denuncie para um membro da staff, (NÃO REALIZE PAGAMENTOS FORA DO SISTEMA DO PIXEL BOT), após a compra você terá 7 dias para reportar qualquer tipo de erro sobre o item para nós, para mais informações ler: <#1052673481373917324>`,
                    fields: [
                        {
                            name: 'Nome do item', value: `\`\`\`${info[1].toString()}\`\`\``, inline: false,
                        },
                        {
                            name: 'Descrição do item', value: `\`\`\`${info[3].toString()}\`\`\``, inline: true,
                        },
                        {
                            name: 'Tipo de item', value: `\`\`\`${info[4].toUpperCase()}\`\`\``, inline: false,
                        },
                        {
                            name: 'Preço', value: `\`\`\`${info[2].toString()}\`\`\``, inline: true,
                        },

                    ],

                }).embed;
                if (isValidUrl(assets[0])) {
                    embd.addFields({ name: 'Video de ilustração', value: assets[0] });
                };
                if (isValidUrl(assets[1])) {
                    embd.setImage(assets[1]);
                };
                interaction.client.guilds.cache.get(interaction.message.guildId).channels.cache.get(channelsId.shop[info[4].toLowerCase()]).send(
                    {
                        content: '',
                        components: [row],
                        embeds: [
                            embd
                        ]
                    }
                ).then(async msg => {
                    sellerDataBase.addItem({
                        messageId: msg.id,
                        downloadUrl: itemUrl,
                        name: info[1],
                        description: info[3],
                        type: info[4].toLowerCase(),
                        price: info[2],
                        timesSelleds: 0,
                        verificadorId: interaction.user.id,
                        buyers: [],
                    });
                    interaction.client.guilds.cache.get(interaction.message.guildId).channels.cache.get(channelsId.auditoria.items).send({
                        content: `Aceita por: ${interaction.user.tag} - \`${interaction.user.id}\` Id da mensagem: ${msg.id}`,
                        embeds: (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds
                    });

                    (await interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get(info[0])).send({
                        content: '', embeds: [
                            new PixelEmbed({
                                author: 'Solicitação ACEITA',
                                description: 'Olá! Venho informar que sua solicitação para um novo item foi `ACEITA` e já está no chat de loja!',
                                fields: [
                                    { name: 'Nome do Item', value: info[1], inline: false },
                                    { name: 'Aceito por', value: `${interaction.user.tag} - \`${interaction.user.id}\``, inline: true },
                                    { name: 'ID do item', value: msg.id, inline: false },
                                    { name: 'Link da mensagem', value: `https://discord.com/channels/830555222752362498/${channelsId.shop[info[4].toLowerCase()]}/${msg.id}` }
                                ],
                                image: 'pixel_store'
                            }).embed
                        ]
                    });
                    try {
                        (await interaction.message.channel.messages.fetch(interaction.message.id)).delete();
                    } catch (error) {
                        console.log("ERRO ModalSubmit.js 99 " + error.toString());
                    }

                });
                interaction.reply({ content: "Solicitação aceitada! O vendedor foi notificado e o item já está na loja!", ephemeral: true });

                break

        }
    }
}