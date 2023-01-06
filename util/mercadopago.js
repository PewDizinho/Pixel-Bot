
const { mercadoPago } = require("../config.json");
const fs = require("fs");
let https = require('https');
module.exports = {
    async comprar(client, comprador, item) {
        var mercadopago = require('mercadopago');
        mercadopago.configurations.setAccessToken(mercadoPago.token);

        var payment_data = {
            transaction_amount: 0.05,
            description: item.name,
            payment_method_id: 'pix',
            payer: {
                email: comprador.email,
                first_name: comprador.username,
                last_name: comprador.id,
                identification: {
                    type: 'CPF',
                    number: comprador.id
                }
            }
        };

        mercadopago.payment.create(payment_data).then(function (data) {
            const id = data.response.id;
            var options = {
                hostname: 'api.mercadopago.com',
                port: 443,
                path: `/v1/payments/${id}`,
                method: 'GET',
                headers: {
                    Authorization: ` Bearer ${mercadoPago.token}`
                }
            };
            https.get(options, (resp) => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    let parsedData = JSON.parse(data);
                    let base64Image = parsedData.point_of_interaction.transaction_data.qr_code_base64.split(';base64,').pop();
                    fs.writeFileSync('assets/image.png', base64Image, { encoding: 'base64' }, function (err) { console.log('File created'); });
                    client.guilds.cache.get("830555222752362498").channels.cache.get("830568759466786817").send({ content: "yo", files: ['./assets/image.png'] });

                });

            })
        });


    },
    async verificarCompra(client, id) {
        var options = {
            hostname: 'api.mercadopago.com',
            port: 443,
            path: `/v1/payments/${id}`,
            method: 'GET',
            headers: {
                Authorization: ` Bearer ${mercadoPago.token}`
            }
        };
        https.get(options, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                let parsedData = JSON.parse(data);
                if(parsedData.status == "approved"){
                    //yeye
                }else if(parsedData.status == "pending"){
                    //nono
                }
               // client.guilds.cache.get("830555222752362498").channels.cache.get("830568759466786817").send({ content: "yo", files: ['./assets/image.png'] });

            });

        })
    }
}
