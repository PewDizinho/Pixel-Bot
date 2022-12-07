const { SlashCommandBuilder, ActionRowBuilder,EmbedBuilder,StringSelectMenuBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Informações básicas do servidor!'),
	async execute(interaction) {
		const row = new ActionRowBuilder()
		.addComponents(
			new StringSelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.setMinValues(1)
					.setMaxValues(1)
					.addOptions([
						{
							label: 'Select me',
							description: 'This is a description',
							value: 'first_option',
						},
						{
							label: 'You can select me too',
							description: 'This is also a description',
							value: 'second_option',
						},
						{
							label: 'I am also an option',
							description: 'This is a description as well',
							value: 'third_option',
						},
					]),
		);

	const embed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('Some title')
		.setURL('https://discord.js.org/')
		.setDescription('Some description here');

	await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] });
	},
};