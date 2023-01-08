const PixelEmbed = require("../util/embed.js");
const { ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    execute(interaction) {
        //
        const selected = interaction.values.join(', ');

        switch (interaction.customId) {

            case 'info':
                var embed, row;
                switch (selected) {
                    case "pixel_store":
                        embed = new PixelEmbed({ author: 'Pixel Store', description: 'A Pixel Store é o nosso site onde você pode vender seu trabalho no minecraft (como construções, mods, plugins, scripts, skripts, texturas ou outros itens de design) para que donos de servidores comprem! Infelizmente, ainda estamos desenvolvendo o site, mas fique esperto! Iremos anunciar qualquer adição no canal <#891465741851848725>!', image: 'pixel_store' }).embed

                        row = new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId('info')
                                    .setPlaceholder('Selecione algo!')
                                    .setMinValues(1)
                                    .setMaxValues(1)
                                    .addOptions([
                                        {
                                            label: 'Pixel Community',
                                            description: 'Mais informações sobre nossa comunidade!',
                                            value: 'pixel_community',
                                        }
                                    ]),
                            );
                        break;
                    case "pixel_community":
                        embed = new PixelEmbed({ author: 'Pixel Community', description: 'A Pixel Community é, como nosso nome já diz, a nossa comunidade! Onde donos de outros servidores podem se ajudar na criação e desenvolvimento de projetos envolvendo minecraft! Tem alguma dúvida? Acha que consegue ajudar alguém? Nossa comunidade é formada por vocês, então contamos com vocês para fazer dela um lugar incrível para todos!', image: 'https://media.discordapp.net/attachments/1052329282069872650/1052329369890205787/Pixel_Community.png?width=473&height=473' }).embed;


                        row = new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId('info')
                                    .setPlaceholder('Selecione algo!')
                                    .setMinValues(1)
                                    .setMaxValues(1)
                                    .addOptions([
                                        {
                                            label: 'Pixel Store',
                                            description: 'Mais informações sobre nossa loja virtual!',
                                            value: 'pixel_store',
                                        }
                                    ]),
                            );

                        break;

                }
                interaction.update({ content: '', ephemeral: false, embeds: [embed], components: [row] });

                break;
            case 'createItem_category':

                const modal = new ModalBuilder()
                    .setCustomId('item_submit')
                    .setTitle(`Nova postagem ${selected.charAt(0).toUpperCase() + selected.slice(1)}`);
                const itemname = new TextInputBuilder()
                    .setCustomId('nome')
                    .setLabel('Qual o nome do seu item?')
                    .setPlaceholder('Ex: "Plugin de Teste"')
                    .setStyle(TextInputStyle.Short);
                const price = new TextInputBuilder()
                    .setCustomId('price')
                    .setLabel('Qual o preço do seu item?')
                    .setPlaceholder('"Ex: R$15"')
                    .setStyle(TextInputStyle.Short);
                const file = new TextInputBuilder()
                    .setCustomId('file_URL')
                    .setLabel('URL para download do seu item')
                    .setPlaceholder("Use DRIVE ou MEDIAFIRE de preferência (Crie um arquivo .rar com seu item e imagens/videos dele")
                    .setStyle(TextInputStyle.Short);
                const description = new TextInputBuilder()
                    .setCustomId('description')
                    .setLabel('Uma breve descrição do item')
                    .setPlaceholder('Ex: "Esse plugin funciona na 1.7.10 e é perfeito para aqueles que precisam de um plugin de teste!"')
                    .setStyle(TextInputStyle.Paragraph);
                const itemtype = new TextInputBuilder()
                    .setCustomId('itemType')
                    .setLabel('Tipo de item (NÃO MEXER)')
                    .setPlaceholder('Ex: "Plugin')
                    .setValue(selected.charAt(0).toUpperCase() + selected.slice(1))
                    .setStyle(TextInputStyle.Short);
                modal.addComponents(new ActionRowBuilder().addComponents(itemname), new ActionRowBuilder().addComponents(price), new ActionRowBuilder().addComponents(file), new ActionRowBuilder().addComponents(description), new ActionRowBuilder().addComponents(itemtype));
                try { interaction.channel.messages.fetch(interaction.message.id).then(msg => msg.delete()); }  catch (error) {
                    console.log("Erro em StringSelectMenu.js 92 : " + error.toString());
                };
                interaction.showModal(modal);
                break;
        }
    }

}