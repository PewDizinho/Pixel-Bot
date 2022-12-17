const { Events, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { channelsId } = require('../config.json');
module.exports = {
    name: Events.InteractionCreate,
    once: false,
    execute(interaction) {
        if (interaction.isStringSelectMenu()) {
            const selected = interaction.values.join(', ');

            console.log(interaction.customId);
            switch (interaction.customId) {
                case 'info':
                    var embed, row;
                    switch (selected) {
                        case "pixel_store":
                            embed = new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setTitle('Pixel Store')
                                .setImage('https://media.discordapp.net/attachments/1052329282069872650/1052329370305450115/Pixel_Store.png?width=473&height=473')
                                .setDescription('A Pixel Store é o nosso site onde você pode vender seu trabalho no minecraft (como construções, mods, plugins, scripts, skripts, texturas ou outros itens de design) para que donos de servidores comprem! Infelizmente, ainda estamos desenvolvendo o site, mas fique esperto! Iremos anunciar qualquer adição no canal <#891465741851848725>!');
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
                            embed = new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setTitle('Pixel Community')
                                .setImage('https://media.discordapp.net/attachments/1052329282069872650/1052329369890205787/Pixel_Community.png?width=473&height=473')
                                .setDescription('A Pixel Community é, como nosso nome já diz, a nossa comunidade! Onde donos de outros servidores podem se ajudar na criação e desenvolvimento de projetos envolvendo minecraft! Tem alguma dúvida? Acha que consegue ajudar alguém? Nossa comunidade é formada por vocês, então contamos com vocês para fazer dela um lugar incrível para todos!');
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
                    //Verificação pra se já foi cadastrado ou não, se não for, manda pra tela de cadastro
                    const modal = new ModalBuilder()
                        .setCustomId('item_submit')
                        .setTitle(`Nova postagem ${selected.charAt(0).toUpperCase() + selected.slice(1)}`);
                    const itemname = new TextInputBuilder()
                        .setCustomId('nome')
                        .setLabel('Qual o nome do seu item?')
                        .setPlaceholder('Ex: "Plugin de Teste')
                        .setStyle(TextInputStyle.Short);

                    const version = new TextInputBuilder()
                        .setCustomId('version')
                        .setLabel('Qual a versão do seu item?')
                        .setPlaceholder('Ex: "1.12.2" ou "1.8 - 1.12.2"')
                        .setStyle(TextInputStyle.Short);
                    const file = new TextInputBuilder()
                        .setCustomId('file_URL')
                        .setLabel('URL para download do seu item')
                        .setPlaceholder("Use MEDIAFIRE, DRIVE ou DROPBOX de preferência")
                        .setStyle(TextInputStyle.Short);
                    const description = new TextInputBuilder()
                        .setCustomId('description')
                        .setLabel('Uma breve descrição do item')
                        .setPlaceholder('Ex: "Esse plugin é perfeito para aqueles que precisam de um plugin de teste!"')
                        .setStyle(TextInputStyle.Paragraph);
                    const itemtype = new TextInputBuilder()
                        .setCustomId('itemType')
                        .setLabel('Tipo de item (NÃO MEXER)')
                        .setPlaceholder('Ex: "Plugin')
                        .setValue(selected.charAt(0).toUpperCase() + selected.slice(1))
                        .setStyle(TextInputStyle.Short);
                    modal.addComponents(new ActionRowBuilder().addComponents(itemname), new ActionRowBuilder().addComponents(version), new ActionRowBuilder().addComponents(file), new ActionRowBuilder().addComponents(description), new ActionRowBuilder().addComponents(itemtype));
                    interaction.showModal(modal);
                    break;
            }
        } else if (interaction.isModalSubmit()) {
            switch (interaction.customId) {
                case 'cadastro_vendedor':
                    var embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Cadastro Vendedor')
                        .setDescription('Username \`\`\` ' + interaction.member.user.tag + '\`\`\`\n\nNick \`\`\`' + interaction.fields.getTextInputValue("nick") + '\`\`\`\n\nDescrição\`\`\`' + interaction.fields.getTextInputValue("description") + '\`\`\`\n ')
                        .setFooter({ text: `| ❎ Negar | ✅ Aceitar | 🔰 Editar |`, iconURL: 'https://media.discordapp.net/attachments/1052329282069872650/1052329371165274132/Pixel_Coin_Blue.png?width=675&height=675' });
                    interaction.reply({ content: "Sua solicitação foi enviada para nossa equipe da staff! Irei te avisar na DM quando ela for aceita.", ephemeral: true });
                    interaction.client.channels.cache.find(channel => channel.id == channelsId.verification.vendedores).send({ embeds: [embed] }).then(msg => { msg.react("✅"); msg.react("❎"); msg.react("🔰"); });
                    break;
                case 'item_submit':
                    var embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Solicitação de item')
                        .setDescription('Username \`\`\`' + interaction.member.user.tag + '\`\`\`\n\nNome do Item \`\`\`' + interaction.fields.getTextInputValue("nome") + '\`\`\`\n\nVersão\`\`\`' + interaction.fields.getTextInputValue("version") + '\`\`\`\n ' + '\nDescrição\`\`\`' + interaction.fields.getTextInputValue("description") + '\`\`\`\n' + `\n[Link](${interaction.fields.getTextInputValue("file_URL")})\`\`\`` + interaction.fields.getTextInputValue("file_URL") + '\`\`\`\n ' + '\nTipo de item\`\`\`' + interaction.fields.getTextInputValue("itemType") + '\`\`\`\n ')
                        .setFooter({ text: `| ❎ Negar | ✅ Aceitar | 🔰 Editar |`, iconURL: 'https://media.discordapp.net/attachments/1052329282069872650/1052329371165274132/Pixel_Coin_Blue.png?width=675&height=675' });
                    interaction.reply({ content: "Sua solicitação foi enviada para nossa equipe da staff! Irei te avisar na DM quando ela for aceita.", ephemeral: true });
                    interaction.client.channels.cache.get(channelsId.verification.items).send({ embeds: [embed] }).then(msg => { msg.react("✅"); msg.react("❎"); msg.react("🔰"); });

                    break;
            }

        }

    },
};
