const { Events } = require('discord.js');
const chalk = require('chalk');
const { version, dataBaseUrl } = require('../config.json');
module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const fs = require('node:fs');





        console.clear();
        console.log(chalk.cyan('Tenha um dia PixelizaLindo!'));
        console.log(chalk.grey('----------------------------'));
        console.log(`      ${chalk.grey('|')} ${chalk.blue('Pixel Bot!')} ${chalk.grey('|')}`);
        console.log(chalk.grey('----------------------------'));
        console.log(`${chalk.grey('Versão')} ${chalk.green(version)}`);
        console.log(`${chalk.grey('Comandos')} ${chalk.green(fs.readdirSync('./commands').filter(file => file.endsWith('.js')).length)}`)
        console.log(`${chalk.grey('Eventos')} ${chalk.green(fs.readdirSync('./events').filter(file => file.endsWith('.js')).length)}`)
        const { connect, default: mongoose } = require("mongoose");
        mongoose.set('strictQuery', true);
        connect(dataBaseUrl, {}).then(() =>
            console.log(`${chalk.grey('DataBase')} ${chalk.green("Connected!")}`)
        );




    },
};