const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require("fs");
const PixelEmbed = require('../../util/embed');

let db;

module.exports = class CompradoresModel {
    constructor({
        userId,
        username,
        userDiscriminator,
    }) {
        this.userId = userId;
        this.username = username;
        this.userDiscriminator = userDiscriminator;
    }

    init() {
        let adapter = new FileSync(`database/json/compradores/${this.userId}.json`)
        db = low(adapter);
        this.create()
    }

    create() {
        //this.init();
        db.defaults({
            UserId: this.userId,
            Compras: {
                realizadas: [],
                pendentes: [],
            },
            GeneralInfo: {
                Username: this.username,
                UserDiscriminator: this.userDiscriminator,
            }
        }).write()
    }

    addCompraPendente(itemInfo) {
        this.init();

        db.get('Compras.pendentes')
            .push(itemInfo)
            .write();
    }

    confirmarCompra(itemId) {
        this.init();
        db.get('Compras.realizadas').push(db.get('Compras.pendentes').find({ compraId: itemId }).value()).write();
        db.get('Compras.pendentes').remove({ compraId: itemId }).write();
    }

    verificarDouble(itemName) {
        this.init();
        if (db.get('Compras.realizadas').find({ name: itemName }).value()) {
            return {
                content: '',
                embeds: [new PixelEmbed({
                    author: "Erro!",
                    description: "Você já comprou esse item!",
                }).embed],
                ephemeral: true
            };
        }
        if (db.get('Compras.pendentes').find({ name: itemName }).value()) {
            fs.writeFileSync('assets/image.png', db.get('Compras.pendentes').find({ name: itemName }).value().qrCode, { encoding: 'base64' }, function (err) { console.log('File created'); });
            return {
                content: "",
                files: ['./assets/image.png'],
                embeds: [new PixelEmbed({
                    author: "Erro!",
                    description: `Você já fez um request para comprar esse item! Aqui está o QR Code para o pagamento, ID da Compra: \`\`\` ${db.get('Compras.pendentes').find({ name: itemName }).value().compraId}\`\`\``,
                }).embed],
                ephemeral: true,
            };
        }
        return false;
    }
}