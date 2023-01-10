const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
let adapter = new FileSync('database/json/item/allItens.json');
let db = low(adapter).get("AllItens");
module.exports = class ItemDataBase {
    constructor({ name, price, authorId }) {
        this.name = name;
        this.price = price;
        this.authorId = authorId;
    };
    addNewItem() {
        db.push({
            "name": this.name,
            "price": (this.price.replace("R$", "")).replace(",", "."),
            "authorId": this.authorId
        }).write();

      
    };
    get getItemByName() {
        return db.find({ "name": this.name }).value();
    }
    get getItemByNameAndPrice() {
        return db.find({ "name": this.name, "price": this.price }).value();
    }
}