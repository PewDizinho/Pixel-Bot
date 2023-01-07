const { model, Schema } = require("mongoose");
const chalk = require('chalk');

module.exports = class DataBase {
    constructor({ userId, user, info, newItem, pix }) {
        this.userId = userId;
        this.user = user;
        this.info = info;
        this.newItem = newItem;
        this.pix = pix;
    }

    create() {

        if (!this.model().getInfo()) {

            this.model().create({
                UserId: this.userId,
                pix: this.pix,
                User: this.user,
                Info: this.info,
                Itens: this.newItem ?? []
            });
            this.save();
        } else {
            throw Error(`${chalk.redBright}[${chalk.red}ERROR${chalk.redBright}] Tentando salvar um vendedor que já existe!\n${chalk.blue}File:${chalk.green}./database/vendedores.js`);
        }


    }
    get getItemByName() {
        let a = {
            itemId: "Math.floor(this.userId/2) + '-' + this.getItensLenght()",
            itemName: "Nome",
            tipo: "plugin",
            price: "25",
            authorId: "XXXXXX",
            videoLink: "XXXXX"
        }
        let itens = this.getInfo().Itens;

    }
    get getItensLength() {
        return this.getInfo().Itens.length;
    }
    addItem() {
        this.getInfo().Itens.push(newItem);
        this.save();

    }

    removeItem() {
        let userInfo = this.getInfo();
        userInfo.Itens.removeAt(userInfo.Itens.indexOf(Itens));
        this.save();
    }
    async getInfo() {
        let userData = await this.model().findOne({ UserId: this.userId });
        if (!userData) return false;
        return userData;
    }

    get model() {
        return model("vendedores_teste", new Schema({
            UserId: String,
            User: Object,
            info: Object,
            itens: Array,
        }));
    }
    async save() {
        await this.getInfo().save();
    }



    // async getTotalCounterModel() {
    //     let counter = await this.totalCounterModel().findOne({ Id: 1 });
    //     return counter;
    // }
    // async addTotalCounterModel() {
    //     let counter = await this.totalCounterModel().findOne({ Id: 1 });
    //     if (counter.Counter.isNaN) {
    //         counter.Counter = 1;
    //     } else {
    //         counter.Counter++;
    //     }
    //     await counter().save;
    // }
    // get totalCounterModel() {
    //     model("quantidade_teste", new Schema({
    //         Id: Number,
    //         Counter: Number,
    //     }));
    // }

};