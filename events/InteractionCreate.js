const { Events } = require('discord.js');
module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (interaction.isStringSelectMenu()) {
            require("./StringSelectMenu.js").execute(interaction);
        } else if (interaction.isButton()) {
            require("./Button.js").execute(interaction);
        } else if (interaction.isModalSubmit()) {
            require("./ModalSubmit.js").execute(interaction);
        }
    },
};