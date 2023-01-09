const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
let db;
let otherDb;

module.exports = class DataBase {
    constructor({ userId, username, userDiscriminator, info, newItem, pix, itemId, fakeName }) {
        this.userId = userId;
        this.username = username;
        this.userDiscriminator = userDiscriminator;
        this.info = info;
        this.newItem = newItem;
        this.pix = pix;
        this.itemId = itemId;
        this.fakeName = fakeName;
    }

    init() {
        otherDb = low(new FileSync(`database/json/vendedores/rawInfo.json`));
        var infos = otherDb.get('RawInfo').find({ FakeName: this.fakeName }).value();
        if (!this.userId) {
            this.userId = infos.UserId;
        }
        let adapter = new FileSync(`database/json/vendedores/${this.userId}.json`)
        db = low(adapter);
    }
    create() {
        this.init();
        db.defaults({
            UserId: this.userId,
            FakeName: this.fakeName,
            GeneralInfo: {
                Username: this.username,
                UserDiscriminator: this.userDiscriminator,
                Info: this.info,
                Pix: this.pix,
                Items: []
            }
        }).write();
        otherDb.get('RawInfo').push({
            FakeName: this.fakeName,
            UserId: this.userId
        }).write();

    }

    editAll() {
        this.init();
        db.set('GeneralInfo', {
            User: this.user,
            Info: this.info,
            Pix: this.pix,
            Items: []
        }).write();
    }

    addItem(newItem) {
        this.init();
        db.get('GeneralInfo.Items')
            .push(newItem)
            .write()
    }

    get getItem() {
        this.init();
        return db.get('GeneralInfo.Items')
            .find({ itemName: this.itemId })
            .value();
    }

    get getAllItens() {
        this.init();
        return db.get('GeneralInfo.Items')
            .value();
    }

    get getSellerFakeName() {
        this.init();
        return db.get('FakeName').value();
    }

    get getSellerId() {
        this.init();
        return otherDb.get('RawInfo').find({ FakeName: this.fakeName }).value().UserId;
    }
};