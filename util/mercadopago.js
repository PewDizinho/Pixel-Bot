
// const MercadoPago = require('mercadopago');
// const { mercadoPago } = require('../config.json');

const { Pix } = require("faz-um-pix");
const fs = require("fs");
module.exports = {
    async execute(client) {
        const code = await Pix("9071d4d0-bc7c-4e74-a8eb-942cc2ca2e12", "PAULO EDUARDO KONOPKA", "CURITIBA", "0.10", "Pedido #123456", true);
        let base64Image = code.split(';base64,').pop();
        fs.writeFileSync('assets/image.png', base64Image, { encoding: 'base64' }, function (err) { console.log('File created'); });
        client.guilds.cache.get("830555222752362498").channels.cache.get("830568759466786817").send({ content: "yo", files: ['./assets/image.png'] });

    }
}
