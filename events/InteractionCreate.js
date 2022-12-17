const { Events, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { channelsId } = require('../config.json');
module.exports = {
    name: Events.InteractionCreate,
    once: false,
    execute(interaction) {
        if (interaction.isStringSelectMenu()) {
            const selected = interaction.values.join(', ');
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
                                .setCustomId('select')
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
                                .setCustomId('select')
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
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId == 'cadastro_vendedor') {
                let embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Cadastro Vendedor')
                    .setDescription('Username \`\`\` ' + interaction.member.user.tag + '\`\`\`\n\nNick \`\`\`' + interaction.fields.getTextInputValue("nick") + '\`\`\`\n\nDescrição\`\`\`' + interaction.fields.getTextInputValue("description") + '\`\`\`\n ')
                    .setFooter({ text: `| ❎ Negar | ✅ Aceitar | 🔰 Editar |`, iconURL: 'https://media.discordapp.net/attachments/1052329282069872650/1052329371165274132/Pixel_Coin_Blue.png?width=675&height=675' });
                interaction.reply({ content: "Sua solicitação foi enviada para nossa equipe da staff! Irei te avisar na DM quando ela for aceita.", ephemeral: true });
                interaction.client.channels.cache.find(channel => channel.id == channelsId.verification.vendedores).send({ embeds: [embed] }).then(msg => { msg.react("✅"); msg.react("❎"); msg.react("🔰"); });
            }
        }

    },
};