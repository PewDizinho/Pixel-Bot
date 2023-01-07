const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const PixelEmbed = require('../util/embed.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('broadcast')
        .setDescription('Envie uma mensagem por mim!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('O canal que eu vou enviar a mensagem!')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('titulo')
                .setDescription('o titulo para ser anunciado')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('A mensagem para ser anunciada')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Uma role para ser mencionada')
        )
        .addStringOption(option =>
            option.setName('image')
                .setDescription('Um link de uma imagem para aparecer')),
    async execute(interaction) {
        interaction.options.getChannel('channel').send({
            content: (interaction.options.getRole('role') ? `<@&${interaction.options.getRole('role').id}>` : ''), embeds: [new PixelEmbed({ author: interaction.options.getString('titulo'), description: interaction.options.getString('message').replace(/{breakline}/g, '\n'), image: interaction.options.getString('image'), footer: { text: `Anunciado por: ${interaction.member.user.tag}`, iconURL: interaction.user.avatarURL() } }).embed]
        });
        await interaction.reply({ content: `Pronto! Sua mensagem foi enviada em ${interaction.options.getChannel("channel")}`, ephemeral: true, })
    }
}
