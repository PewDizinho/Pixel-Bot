
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const DataBaseSellers = require("../database/models/vendedores.js");
const { channelsId, rolesId, porcentagem } = require("../config.json");
const PixelEmbed = require('../util/embed.js');

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
                interaction.client.guilds.cache.get(interaction.message.guildId).channels.cache.get(channelsId.auditoria.vendedores).send({ content: `Aceito por: ${interaction.user.tag} - \`${interaction.user.id}\``, embeds: (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds })
                await interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get((await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0].author.name).send({
                    content: "", embeds: [new PixelEmbed(
                        {
                            author: "Pixel Store",
                            description: `Parabéns! A solicitação para **vendedor** foi **aceita** por ${interaction.user.tag} - \`${interaction.user.id}\``,
                            image: "pixel_store",
                            fields: [
                                { name: 'Agora você faz parte da equipe de vendedores da Pixel!', value: 'E isso irá te trazer grandes responsabilidades!', inline: true },
                                { name: 'Termos de Serviço', value: 'Leia nosso TOS em <#1052673481373917324> antes de realizar uma venda!', inline: false },
                                { name: 'Mensgem de instruções', value: "A seguir iremos enviar uma mensagem com informações e instruções de como realizar vendas dentro da Pixel Store!", inline: true },
                                { name: 'Seja bem vindo(a)!', value: 'A equipe Pixel lhe dá boas vindas!', inline: false }
                            ]
                        }).embed,
                    new PixelEmbed({
                        author: embedInfo[4].split("`")[3],
                        description: `A partir de agora você será conhecido como \`${embedInfo[4].split("`")[3]}\`, assim como dito no nosso Termos de Serviço você não pode fazer nenhum tipo de ação que faça com que o seu perfil falso (\`${embedInfo[4].split("`")[3]}\`) tenha algum tipo de relação com seu nick verdadeiro, para evitar qualquer tipo de interação direto com o cliente, como dito em nossa TOS, é EXTREMAMENTE PROÍBIDO a realização de vendas com clientes Pixel por fora do sistema de bot, para aumentar a segurança do vendedor e do cliente`,
                        fields: [
                            { name: 'Como anunciar um item?', value: 'Dentro do servidor você pode executar \`/createItem\` e preencher o formulário' },
                            { name: 'Formulário', value: 'O Formulário tem 5 espaços para o preenchimento, mas você só irá preencher 4' },
                            { name: 'Nome', value: 'Nome Do item; Tentar ser breve, algo como "Casa do Goku" ou "Plugin de Orbs' },
                            { name: 'Preço', value: `O preço do item, lembre-se que %${porcentagem} será descontado desse valor automaticamente como taxa da Pixel, por favor leia a nossa TOS para mais informações sobre o recebimento do dinehrio` },
                            { name: 'URL', value: 'Pedimos que crie um arquivo .rar com: O arquivo de download do seu item, um video de instalação (ambos serão enviados automaticamente para o cliente após o pagamento for aprovado) e videos ou imagens mostrando o produto' },
                            { name: 'Descrição', value: 'Uma descrição sobre seu item, seja especifico quanto a versão, dependências ou informações adicionais' },
                            { name: 'Tipo de Item', value: 'Não mexer nessa área.' },
                            { name: 'Irregularidades', value: 'Todos os itens passaram por uma verificação antes de serem postados, caso haja irregularidades o produto irá ser negado' }
                        ]
                    }).embed
                    ]
                });
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