const { Events } = require('discord.js');
const fs = require('node:fs');
const chalk = require('chalk');
const { version } = require('../config.json');


module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.clear();
        console.log(chalk.cyan('Tenha um dia PixelizaLindo!'));
        console.log(chalk.grey('----------------------------'));
        console.log(`      ${chalk.grey('|')} ${chalk.blue('Pixel Bot!')} ${chalk.grey('|')}`);
        console.log(chalk.grey('----------------------------'));
        console.log(`${chalk.grey('Versão')} ${chalk.green(version)}`);
        console.log(`${chalk.grey('Comandos')} ${chalk.green(fs.readdirSync('./commands').filter(file => file.endsWith('.js')).length)}`)
        console.log(`${chalk.grey('Eventos')} ${chalk.green(fs.readdirSync('./events').filter(file => file.endsWith('.js')).length)}`)


        // console.log(`${chalk.grey('DataBase')} ${chalk.green("Connected!")}`)

    },
};