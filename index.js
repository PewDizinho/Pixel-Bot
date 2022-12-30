
const { Client, Events, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { token, ownerId } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
	],
	partials: [
		Partials.Message,
		Partials.Channel, Partials.Reaction,
	],
});





client.cooldowns = new Collection();
client.COOLDOWN_SECONDS = 10;
//COMMANDS 
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
////EVENTS

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	if (client.cooldowns.has(interaction.user.id) && interaction.user.id != ownerId) {
		interaction.reply({ content: "Espere um pouco para executar outro comando!", ephemeral: true });
		return;
	}
	client.cooldowns.set(interaction.user.id, true);
	setTimeout(() => {
		client.cooldowns.delete(interaction.user.id);
	}, client.COOLDOWN_SECONDS * 1000);

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});






client.login(token);