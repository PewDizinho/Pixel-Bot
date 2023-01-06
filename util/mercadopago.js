
const { mercadoPago, defaultFooter } = require("../config.json");
const fs = require("fs");
let https = require('https');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    comprar(interaction, comprador, item) {
        var mercadopago = require('mercadopago');
        mercadopago.configurations.setAccessToken(mercadoPago.token);

        var payment_data = {
            transaction_amount: item.price,
            description: item.name,
            payment_method_id: 'pix',
            payer: {
                email: comprador.email,
                first_name: comprador.username,
                last_name: comprador.username,
                identification: {
                    number: '19119119100',
                    type: "CPF"
                },
            },

        };
        console.log(payment_data)
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
                    const embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle(`Pagamento N°: ${id}`)
                        .setDescription("Escaneie o código PIX acima e realize o pagamento, após isso, execute `/verificarCompra {ID}` para verificar o status do seu pagamento")
                        .setFooter(defaultFooter);
                    interaction.reply({ content: "yo2", files: ['./assets/image.png'], embeds: [embed], ephemeral: true, });
                    return true;
                });

            })
        });


    },
    verificarCompra(interaction, id) {
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
                if (parsedData.status == "approved") {
                    interaction.reply({ content: "Seu pagamento foi confirmado!", ephemeral: true, })

                } else if (parsedData.status == "pending") {
                    interaction.reply({ content: "Seu pagamento não foi confirmado, caso você já tenha realizado o pagamento, entrar em contato com PewDizinho#3014", ephemeral: true, })

                }

            });

        })
    }
}
