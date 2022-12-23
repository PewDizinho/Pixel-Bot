const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, UserSelectMenuComponent } = require('discord.js');
const DataBase = require('../database/testing.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('teste')
        .setDescription('test')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const newSellerObject = {
            UserId: 2,
            Edit: "yo"
        };


        let user = await DataBase.findOne({ UserId: 2 });
        if (user) {

            user.Edit = "Changed!";
            await user.save();

        } else {
            await DataBase.create(newSellerObject);
            console.log("Created");

        }


        console.log( await DataBase.findOne({ UserId: 2 }));

    }
}
