const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
let db;

const chalk = require('chalk');

module.exports = class DataBase {
    constructor({ userId, username, userDescriminator, info, newItem, pix, itemId }) {
        this.userId = userId;
        this.username = username;
        this.userDescriminator = userDescriminator;
        this.info = info;
        this.newItem = newItem;
        this.pix = pix;
        this.itemId = itemId;

    }

    init() {
        let adapter = new FileSync(`database/json/${this.userId}.json`)
        db = low(adapter);
    }
    create() {
        this.init();
        db.defaults({
            UserId: this.userId,
            GeneralInfo: {
                Username: this.username,
                UserDescriminator: this.userDescriminator,
                Info: this.info,
                Pix: this.pix,
                Items: []
            }
        }).write()
    }

    editAll() {
        db.set('GeneralInfo', {
            User: this.user,
            Info: this.info,
            Pix: this.pix,
            Items: []
        }).write();
    }

    addItem() {
        db.get('GeneralInfo.Items')
            .push(this.newItem)
            .write()
    }

    get getItem() {
        return db.get('GeneralInfo.Items')
            .find({ itemName: this.itemId })
            .value();
    }

    get getAllItens() {
        return db.get('GeneralInfo.Items')
            .value();
    }
};