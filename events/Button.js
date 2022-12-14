
var { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
var DataBaseSellers = require("../database/models/vendedores.js");
var { channelsId, rolesId, porcentagem } = require("../config.json");
var PixelEmbed = require('../util/embed.js');
const mercadopago = require('../util/mercadopago.js');
const CompradoresModel = require('../database/models/compradores.js');
const DataBase = require('../database/models/vendedores.js');

module.exports = {
    async execute(interaction) {
        switch (interaction.customId) {
            case 'vendedor_submit_aceitar':
                var embed = (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0];
                var memberObject = interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get(embed.author.name);
                var embedInfo = embed.description.replace("+", ',').split("\n")

                var seller = new DataBaseSellers({
                    userId: memberObject.id,
                    username: memberObject.username,
                    userDiscriminator: memberObject.discriminator,
                    fakeName: embedInfo[4].split("`")[3].toString(),
                    pix: embedInfo[8].split("`")[3] + "1",
                    info: {

                        description: embedInfo[6].split("`")[3],
                        type: [false, false, false, false, false, false],
                        verificatorId: interaction.user.id
                    },

                });
                seller.create();
                interaction.client.guilds.cache.get(interaction.message.guildId).channels.cache.get(channelsId.auditoria.vendedores).send({ content: `Aceito por: ${interaction.user.tag} - \`${interaction.user.id}\``, embeds: (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds })
                await interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get((await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0].author.name).send({
                    content: "", embeds: [new PixelEmbed(
                        {
                            author: "Pixel Store",
                            description: `Parab??ns! A solicita????o para **vendedor** foi **aceita** por ${interaction.user.tag} - \`${interaction.user.id}\``,
                            image: "pixel_store",
                            fields: [
                                { name: 'Agora voc?? faz parte da equipe de vendedores da Pixel!', value: 'E isso ir?? te trazer grandes responsabilidades!', inline: true },
                                { name: 'Termos de Servi??o', value: 'Leia nosso TOS em <#1052673481373917324> antes de realizar uma venda!', inline: false },
                                { name: 'Mensgem de instru????es', value: "A seguir iremos enviar uma mensagem com informa????es e instru????es de como realizar vendas dentro da Pixel Store!", inline: true },
                                { name: 'Seja bem vindo(a)!', value: 'A equipe Pixel lhe d?? boas vindas!', inline: false }
                            ]
                        }).embed,
                    new PixelEmbed({
                        author: embedInfo[4].split("`")[3],
                        description: `A partir de agora voc?? ser?? conhecido como \`${embedInfo[4].split("`")[3]}\`, assim como dito no nosso Termos de Servi??o voc?? n??o pode fazer nenhum tipo de a????o que fa??a com que o seu perfil falso (\`${embedInfo[4].split("`")[3]}\`) tenha algum tipo de rela????o com seu nick verdadeiro, para evitar qualquer tipo de intera????o direto com o cliente, como dito em nossa TOS, ?? EXTREMAMENTE PRO??BIDO a realiza????o de vendas com clientes Pixel por fora do sistema de bot, para aumentar a seguran??a do vendedor e do cliente`,
                        fields: [
                            { name: 'Como anunciar um item?', value: 'Dentro do servidor voc?? pode executar \`/createItem\` e preencher o formul??rio' },
                            { name: 'Formul??rio', value: 'O Formul??rio tem 5 espa??os para o preenchimento, mas voc?? s?? ir?? preencher 4' },
                            { name: 'Nome', value: 'Nome Do item; Tentar ser breve, algo como "Casa do Goku" ou "Plugin de Orbs' },
                            { name: 'Pre??o', value: `O pre??o do item, lembre-se que %${porcentagem} ser?? descontado desse valor automaticamente como taxa da Pixel, por favor leia a nossa TOS para mais informa????es sobre o recebimento do dinehrio` },
                            { name: 'URL', value: 'Pedimos que crie um arquivo .rar com: O arquivo de download do seu item, um video de instala????o (ambos ser??o enviados automaticamente para o cliente ap??s o pagamento for aprovado) e videos ou imagens mostrando o produto' },
                            { name: 'Descri????o', value: 'Uma descri????o sobre seu item, seja especifico quanto a vers??o, depend??ncias ou informa????es adicionais' },
                            { name: 'Tipo de Item', value: 'N??o mexer nessa ??rea.' },
                            { name: 'Irregularidades', value: 'Todos os itens passaram por uma verifica????o antes de serem postados, caso haja irregularidades o produto ir?? ser negado' }
                        ]
                    }).embed
                    ]
                });
                await interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get((await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0].author.name).roles.add(interaction.client.guilds.cache.get(interaction.message.guildId).roles.cache.find(role => role.id == rolesId.verificado));
                interaction.message.delete();
                interaction.reply({ content: "Solicita????o aceita! O membro foi avisado e essa solicita????o foi salva na minha DataBase!", ephemeral: true });

                break;
            case 'vendedor_submit_negar':

                var modal = new ModalBuilder()
                    .setCustomId('verification_deny_reason')
                    .setTitle('Negar Pedido de Verifica????o');

                modal.addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('reason')
                            .setLabel('Motivo')
                            .setPlaceholder('Esse motivo ser?? enviado para o membro')
                            .setStyle(TextInputStyle.Paragraph)

                    ),
                    new ActionRowBuilder().addComponents(new TextInputBuilder()
                        .setCustomId('improvement')
                        .setLabel('Sugest??o de melhora')
                        .setPlaceholder('Ex: "N??o utilize seu nome verdadeiro para a verifica????o')
                        .setStyle(TextInputStyle.Paragraph))
                );
                interaction.showModal(modal);
                break;
            case 'item_submit_aceitar':
                var embed = (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0];
                var memberObject = interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get(embed.author.name);
                var embedInfo = embed.description.replace("+", ',').split("\n");

                interaction.showModal(
                    new ModalBuilder()
                        .setCustomId('item_submit_aceitar')
                        .setTitle('Aceitar Item')
                        .addComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('urlitem')
                                    .setLabel('Url (Item + Video instala????o)')
                                    .setPlaceholder('Link Drive (DIFERENTE DO FORNECIDO PELO VENDEDOR) com download do item e o video de instala????o')
                                    .setStyle(TextInputStyle.Short),
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('urlimage')
                                    .setLabel('Url direto para imagem/video')
                                    .setPlaceholder('Url direto para um video ou imagem demonstrando o produto')
                                    .setStyle(TextInputStyle.Short)
                                    .setValue("VIDEOURL|IMAGEURL"),
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('info')
                                    .setLabel('informa????es alheias (N??O MEXER)')
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setValue(`${embed.author.name}|${embedInfo[2].split("`")[3]}|${embedInfo[4].split("`")[3]}|${embedInfo[6].split("`")[3]}|${embedInfo[10].split("`")[3]}`),
                            ),
                        ),
                );

                break;
            case 'item_submit_negar':
                var embed = (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0];
                var memberObject = interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get(embed.author.name);
                var embedInfo = embed.description.replace("+", ',').split("\n");

                interaction.showModal(
                    new ModalBuilder()
                        .setCustomId('item_submit_negar')
                        .setTitle('Negar Item')
                        .addComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('motivo')
                                    .setLabel('Motivo para negar')
                                    .setPlaceholder('Ex: "Link inv??lido, favor colocar um video de instala????o"')
                                    .setStyle(TextInputStyle.Paragraph),
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('userid')
                                    .setLabel('Id do usu??rio (N??o mexer)')
                                    .setStyle(TextInputStyle.Short)
                                    .setValue(memberObject.id),
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('itemname')
                                    .setLabel('Nome do item (N??o mexer)')
                                    .setStyle(TextInputStyle.Short)
                                    .setValue(embedInfo[2].split("`")[3]),
                            ),
                        ),
                );

                break;
            case 'item_comprar':
                var embed = (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0];
                var memberObject = interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get(embed.author.name);
                var embedInfo = embed.description.replace("+", ',').split("\n");
                var itemInfo = {
                    name: `${embed.fields[0].value.split('`')[3]}-${embed.author.name}`,
                    price: embed.fields[3].value.split('`')[3],
                    user: interaction.user.id,
                    username: interaction.user.username,
                    messageId: interaction.message.id
                }
                const isOnSale = new CompradoresModel({
                    userId: interaction.user.id,
                    username: interaction.user.username,
                    userDiscriminator: interaction.user.discriminator,
                }).verificarDouble(`${embed.fields[0].value.split('`')[3]}-${embed.author.name}`);
                if (isOnSale) {
                    interaction.reply(isOnSale)
                } else {
                    mercadopago.realizarCompra(interaction, itemInfo);
                }

                break;
            case 'item_chat':
                //DOING
                var embed = (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0];
                var memberObject = interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get(embed.author.name);
                var sellerId = new DataBase({ fakeName: embed.author.name }).getSellerId;
                const clientId = interaction.user.id;
                const sellerObject = await interaction.guild.members.fetch(sellerId)
                const categoryId = '1054100659718340649';

                const chatName = `${clientId.substring(clientId.length - 5)}-${sellerId.substring(sellerId.length - 5)}`;
                const chatName2 = `${sellerId.substring(sellerId.length - 5)}-${clientId.substring(clientId.length - 5)}`;



                await interaction.guild.channels.cache.get("1054100659718340649").children.cache.forEach(channel => {
                    if (channel.name == chatName2 || channel.name == chatName) {
                        channel.delete();
                    }
                }
                );
                interaction.guild.channels.create({
                    name: chatName2,
                    type: ChannelType.GuildText,
                    parent: categoryId,
                    topic: chatName,

                    permissionOverwrites: [
                        {
                            id: '830555222752362498',
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: sellerId,
                            allow: [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                }).then(channel => {
                    channel.send({
                        content: "Vendedor",
                        embeds: [new PixelEmbed({
                            author: "Regras do Chat",
                            description: "Voc?? est?? prestes a falar com um comprador interessado pelo seu produto, siga as seguintes regras e denuncie o comprador caso ele quebre alguma dessas regras usando /denunciar nesse chat!",
                            fields: [
                                { name: "Informa????es", value: "\``\`\`N??o repasse nenhum tipo de informa????o pessoal, como Nome real do discord ou o item em quest??o\`\`\`", inline: true },
                                { name: "Anonimato", value: "\`\`\`N??o aceite iniciar uma conversa por fora desse chat, a Pixel n??o tem poder para prestar auxilio sobre assuntos acontecidos fora do nosso poder, mantenha tudo aqui e denuncie qualquer comprador que tente te convencer a ir para outro chat (como privado), e se apresente como seu nome falso, se refira ao cliente como \"cliente\"\`\`\`", inline: true },
                                { name: "Pagamento", value: "\`\`\`DE MODO ALGUM exija por informa????es sobre o pagamento ou por outro pagamento\`\`\`", inline: true },
                                { name: "Penalidades", value: "\`\`\`O Cliente tem o poder de denunciar essa conversa, Vendedores que forem pegos quebrando as regras acima ir??o: Perder seu cargo de vendedor, ser expulso da Pixel, e perder?? todo dinheiro retido (seja pelos 7 dias p??s compra ou 16 dias de suporte)\`\`\`", inline: true },

                            ]
                        }).embed,
                        ]
                    });
                    channel.send({
                        content: "Item em quest??o",
                        embeds: [embed]
                    })
                });
                //
                interaction.guild.channels.create({
                    name: chatName,
                    type: ChannelType.GuildText,
                    parent: categoryId,
                    topic: chatName2,
                    permissionOverwrites: [
                        {
                            id: '830555222752362498',
                            deny: [PermissionFlagsBits.ViewChannel],
                        }, {
                            id: interaction.user.id,
                            allow: [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                }).then(channel => {
                    channel.send({
                        content: "Cliente",
                        embeds: [new PixelEmbed({
                            author: "Regras do Chat",
                            description: "Voc?? est?? prestes a falar com o criador do produto, siga as seguintes regras e denuncie o vendedor caso ele quebre alguma dessas regras usando /denunciar nesse chat!",
                            fields: [
                                { name: "Informa????es", value: "\`\`\`N??o repasse nenhum tipo de informa????o pessoal, como Nome real do discord ou informa????es de pagamento\`\`\`", inline: true },
                                { name: "Anonimato", value: "\`\`\`N??o aceite iniciar uma conversa por fora desse chat, a Pixel n??o tem poder para prestar auxilio sobre assuntos acontecidos fora do nosso poder, mantenha tudo aqui e denuncie qualquer vendedor que tente te convencer a ir para outro chat (como privado)\`\`\`", inline: true },
                                { name: "Pagamento", value: "\`\`\`DE MODO ALGUM realize um pagamento direto com o vendedor, caso voc?? realize uma compra direta com o vendedor, a Pixel **N??O** ir?? prestar suporte\`\`\`", inline: true },
                                { name: "D??vidas", value: "\`\`\`Mantenha sua pergunta sobre o item especificado, seja breve, exemplo: \"O qu??o configur??vel ?? esse plugin?\", \"Qual o tamanho dessa constru????o?\"\`\`\`", inline: false },
                                { name: "Fechar o chat", value: "\`\`\`Ap??s todas suas d??vidas serem tiradas, execute /fecharchat dentro do chat, e o chat ir?? ser fechado.\`\`\`", inline: true },
                            ]
                        }).embed]
                    });
                });
                interaction.reply({ content: "Um canal para a conversa foi criado!", ephemeral: true });
                break;
        }
    }

}