const { Message, SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, Discord, PermissionFlagsBits } = require('discord.js');

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
        .addStringOption(option =>
            option.setName('image')
                .setDescription('Um link de uma imagem para aparecer')),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(interaction.options.getString('titulo'))
            .setDescription(interaction.options.getString('message').replace(/{breakline}/g, '\n'))
            .setImage(interaction.options.getString('image'))
            .setFooter({ text: `Anunciado por: ${interaction.member.user.tag}`, iconURL: interaction.user.avatarURL() })
            ;
        interaction.options.getChannel('channel').send({ content: '', embeds: [embed] });
        await interaction.reply({ content: `Pronto! Sua mensagem foi enviada em ${interaction.options.getChannel("channel")}`, ephemeral: true, })
    }
}


// /broadcast channel:#termos-de-uso titulo::Pixel_Coin_Green: Vendedores :Pixel_Coin_Green:  message::info: Como funciona para vendedores? {breakline}{breakline} :Number_one: Vendedores podem anunciar mediante o comando `/anunciar`, e então deverá escolher entre as categorias: {breakline}:icone_build: Build{breakline}:icone_design: Design{breakline} Mod{breakline}:icone_plugin: Plugin{breakline}:icone_script: Script{breakline}:icone_skript: Skript{breakline} E então uma mensagem com seu produto será enviado no canal específico de seu item, junto de uma descrição, vídeo e preço, caso uma pessoa esteja interessada em realizar a compra, vocês irão 