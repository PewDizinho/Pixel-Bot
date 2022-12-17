const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionFlagsBits, StringSelectMenuBuilder, TextInputStyle, ModalBuilder, TextInputBuilder } = require('discord.js');
const { defaultFooter } = require("../config.json");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('createitem')
        .setDescription('Crie um item!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Pixel Store')
            .setThumbnail('https://media.discordapp.net/attachments/1052329282069872650/1052329370305450115/Pixel_Store.png?width=675&height=675')
            .setDescription('Enquanto nosso site não fica pronto, você pode realizar vendas pelo nosso discord!\n\n❗❗ **Atenção! Leia as [informações](https://discord.com/channels/830555222752362498/1052673481373917324) sobre vendas antes antes de utilizar esse comando!**❗❗\n\n')
            .setFooter(defaultFooter)
            .setTimestamp();
        interaction.channel.send({ content: '', ephemeral: true, embeds: [embed] }).then(msg => {
            setTimeout(() => { msg.delete(); }
                , 15 * 1000);
        });

        setTimeout(() => {
            //TO-DO 
            //Verificação pra se já foi cadastrado ou não, se não for, manda pra tela de cadastro
            const modal = new ModalBuilder()
                .setCustomId('item_submit')
                .setTitle('Nova postagem');
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
            // const file = new TextInputBuilder()
            //     .setCustomId('file_URL')
            //     .setLabel('URL para download do seu item')
            //     .setPlaceholder("Use MEDIAFIRE, DRIVE ou DROPBOX de preferência")
            //     .setStyle(TextInputStyle.Short);
            const description = new TextInputBuilder()
                .setCustomId('description')
                .setLabel('Uma breve descrição do item')
                .setPlaceholder('Ex: "Esse plugin é perfeito para aqueles que precisam de um plugin de teste!"')
                .setStyle(TextInputStyle.Paragraph);

            modal.addComponents(new ActionRowBuilder().addComponents(itemname), new ActionRowBuilder().addComponents(version), new ActionRowBuilder().addComponents(file), new ActionRowBuilder().addComponents(description));
            interaction.showModal(modal);
        }, 2 * 1000);

    }
}