const { Events, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require('discord.js');
const { channelsId, defaultFooter, rolesId } = require('../config.json');
const DataBaseSellers = require('../DataBase/vendedores.js');
module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (interaction.isStringSelectMenu()) {
            const selected = interaction.values.join(', ');
            //
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
                    interaction.channel.messages.fetch(interaction.message.id).then(msg => msg.delete());
                    interaction.showModal(modal);
                    break;
            }
        } else if (interaction.isModalSubmit()) {
            switch (interaction.customId) {
                case 'cadastro_vendedor':
                    var embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Cadastro Vendedor')
                        .setAuthor({ name: interaction.user.id, iconURL: 'https://cdn.discordapp.com/attachments/1052329282069872650/1052329371165274132/Pixel_Coin_Blue.png' })
                        .setDescription('ID: \`\`\` ' + interaction.user.id + '\`\`\`\n\n' + 'Username \`\`\` ' + interaction.user.tag + '\`\`\`\n\nNick \`\`\`' + interaction.fields.getTextInputValue("nick") + '\`\`\`\n\nDescrição\`\`\`' + interaction.fields.getTextInputValue("description") + '\`\`\`\n ')
                        .setFooter(defaultFooter);
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
                    var embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Solicitação de item')
                        .setDescription('Username \`\`\`' + interaction.user.member.tag + '\`\`\`\n\nNome do Item \`\`\`' + interaction.fields.getTextInputValue("nome") + '\`\`\`\n\nVersão\`\`\`' + interaction.fields.getTextInputValue("version") + '\`\`\`\n ' + '\nDescrição\`\`\`' + interaction.fields.getTextInputValue("description") + '\`\`\`\n' + `\n[Link](${interaction.fields.getTextInputValue("file_URL")})\`\`\`` + interaction.fields.getTextInputValue("file_URL") + '\`\`\`\n ' + '\nTipo de item\`\`\`' + interaction.fields.getTextInputValue("itemType") + '\`\`\`\n ')
                        .setFooter(defaultFooter);
                    interaction.reply({ content: "Sua solicitação foi enviada para nossa equipe da staff! Irei te avisar na DM quando ela for aceita.", ephemeral: true });
                    interaction.client.channels.cache.find(channel => channel.id == channelsId.verification.items).send({ embeds: [embed], components: [row] });

                    break;
                case 'verification_deny_reason':

                    interaction.client.guilds.cache.get(interaction.message.guildId).channels.cache.get(channelsId.auditoria.vendedores).send({ content: `Negado por: ${interaction.user.tag} - \`${interaction.user.id}\` motivo: \`${interaction.fields.getTextInputValue("reason")}\``, embeds: (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds })
                    await interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get((await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0].author.name).send(`Olá! Venho informar que sua solicitação para **vendedor** foi **negada** por ${interaction.user.tag} - \`${interaction.user.id}\` motivo: \`${interaction.fields.getTextInputValue("reason")}\``);
                    interaction.message.delete();
                    interaction.reply({ content: "Solicitação negada! Sua mensagem foi enviada para o membro e foi salva na minha DataBaseSellers!", ephemeral: true });
                    break;
            }

        } else if (interaction.isButton()) {
            // console.log(interaction.customId);

            switch (interaction.customId) {
                case 'vendedor_submit_aceitar':
                    const embed = (await interaction.message.channel.messages.fetch(interaction.message.id)).embeds[0];
                    const memberObject = interaction.client.guilds.cache.get(interaction.message.guildId).members.cache.get(embed.author.name);
                    const embedInfo = embed.description.replace("+", ',').split("\n")

                    await DataBaseSellers.create({
                        UserId: memberObject.id,
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

            }
        }

    },
};