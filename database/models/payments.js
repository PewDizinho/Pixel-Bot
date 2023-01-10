const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
let adapter = new FileSync('database/json/item/payments.json');
let db = low(adapter);
const { porcentagem } = require('../../config.json');
const DataBase = require('./vendedores');
module.exports = class Payments {
    constructor({
        price, authorId
    }) {
        this.price = price;
        this.authorId = authorId;
    }

    addPendente() {

        if (this.checkIfIsDoubledInBoth) {
            var future = new Date();
            future.setDate(future.getDate() + 7);
            var today = new Date();
            db.get('pendentes').push({
                today: (today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate()).toString(),
                SeveDaysToToday: (future.getFullYear() + '-' + ((future.getMonth() + 1) < 10 ? '0' : '') + (future.getMonth() + 1) + '-' + future.getDate()).toString(),
                authorId: this.authorId,
                value: (this.price - (this.price / 100) * Number(porcentagem)).toString(),
                totalPrice: this.price.toString(),
                pix: new DataBase({ userId: this.authorId }).getPix.toString()
            }).write();
        }
    };

    markAsPaid() {
        if (this.checkIfIsDoubledInBoth) {
            db.get('realizados').push(db.get('pendentes').find({ value: (this.price - (this.price / 100) * Number(porcentagem)).toString(), authorId: this.authorId }).value());
            pendentes.remove({ value: (this.price - (this.price / 100) * Number(porcentagem)).toString(), authorId: this.authorId }).write();
        }
    }
    get checkIfIsDoubledInBoth() {

        if (db.get('pendentes').find(({ value: (this.price - (this.price / 100) * Number(porcentagem)).toString(), authorId: this.authorId })).value() || db.get('realizados').find(({ value: (this.price - (this.price / 100) * Number(porcentagem)).toString(), authorId: this.authorId })).value()) {
            return false;
        }
        return true;
    }
}