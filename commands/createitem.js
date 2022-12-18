const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionFlagsBits, StringSelectMenuBuilder } = require('discord.js');
const { defaultFooter } = require("../config.json");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('createitem')
        .setDescription('Crie um item!')
   .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Pixel Store')
            .setThumbnail('https://media.discordapp.net/attachments/1052329282069872650/1052329370305450115/Pixel_Store.png?width=675&height=675')
            .setDescription('Enquanto nosso site não fica pronto, você pode realizar vendas pelo nosso discord!\n\n❗❗ **Atenção! Leia as [informações](https://discord.com/channels/830555222752362498/1052673481373917324) sobre vendas antes antes de utilizar esse comando!**❗❗\n\n```Selecione a categoria do seu produto:```\n<:icone_build:890833814404874282> Build\n<:icone_design:891187765377654794> Design\n<:icone_mod:891187783727726634> Mod\n<:icone_plugin:890834022744326174> Plugin\n<:icone_script:890834010211774484> Script\n<:icone_skript:891187753226735646> Skript')
            .setFooter(defaultFooter)
            .setTimestamp();


        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('createItem_category')
                    .setPlaceholder('Selecione algo!')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions([
                        {
                            label: 'Build',
                            description: 'Construções!',
                            value: 'build',
                        },
                        {
                            label: 'Design',
                            description: 'Texturas, Logos, banners, skins entre outros!',
                            value: 'design',
                        },
                        {
                            label: 'Mod',
                            description: 'Mod próprio!',
                            value: 'mod',
                        },
                        {
                            label: 'Plugin',
                            description: 'Plugins próprios!',
                            value: 'plugin',
                        },
                        {
                            label: 'Script',
                            description: 'Script de CustomNPC!',
                            value: 'script',
                        },
                        {
                            label: 'Skript',
                            description: 'Skripts do plugin Skript!',
                            value: 'skript',
                        },
                    ]),
            );
        await interaction.reply({ content: `<@${interaction.member.user.id}>`, ephmeral: true, embeds: [embed], components: [row] });
        const message = await interaction.fetchReply()
        setTimeout(async () => {
            message.delete();
        }, 90 * 1000);


        // ['<:icone_build:890833814404874282>', '<:icone_design:891187765377654794>', '<:icone_mod:891187783727726634>', '<:icone_plugin:890834022744326174>', '<:icone_script:890834010211774484>', '<:icone_skript:891187753226735646>'];
    }
}