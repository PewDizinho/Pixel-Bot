const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
    .setName('denunciar')
    .setDescription('Denuncie um vendedor ou cliente! (Execute dentro do chat de conversa)'),


    async execute(interaction){
            var l = interaction.channel.members;//.name .parentId .permissionOverwrites .topic
            console.log(l)
    }
}