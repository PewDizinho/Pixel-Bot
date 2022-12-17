const { SlashCommandBuilder, ActionRowBuilder,EmbedBuilder,StringSelectMenuBuilder } = require('discord.js');

module.exports = {
	data: 
	
	new SlashCommandBuilder()
		.setName('info')
		.setDescription('Informações básicas do servidor!'),
	async execute(interaction) {
	
		const row = new ActionRowBuilder()
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
						},
						{
							label: 'Pixel Community',
							description: 'Mais informações sobre nossa comunidade!',
							value: 'pixel_community',
						}
					]),
		);
		const embed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('Pixel')
		.setThumbnail('https://media.discordapp.net/attachments/1052329282069872650/1052329371165274132/Pixel_Coin_Blue.png?width=675&height=675')
		.setDescription('Escolha as opções abaixo! \n\n<:Pixel_TC:892224665030901800> Pixel Store\n\n<:Pixel_Coin_Green:1052329968090218617> Pixel Community');

	await interaction.reply({ content: '', ephemeral: true, embeds: [embed], components: [row] });

	},
};
