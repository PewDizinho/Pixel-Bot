const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const PixelEmbed = require('../util/embed');

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



		await interaction.reply({ content: '', ephemeral: true, embeds: [new PixelEmbed({ author: "Pixel", description: 'Escolha as opções abaixo! \n\n<:Pixel_TC:892224665030901800> Pixel Store\n\n<:Pixel_Coin_Green:1052329968090218617> Pixel Community', thumbnail: 'coin_blue' }).embed], components: [row] });

	},
};
