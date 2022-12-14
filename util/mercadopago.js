
const { mercadoPago } = require("../config.json");
const fs = require("fs");
let https = require('https');
const PixelEmbed = require("./embed");
const CompradoresModel = require("../database/models/compradores");
const ItemDataBase = require("../database/models/item");
const DataBase = require("../database/models/vendedores");
const Payments = require("../database/models/payments");

module.exports = {
    realizarCompra(interaction, itemInfo) {
        itemInfo.price = itemInfo.price.replace('R$', "");
        itemInfo.price = itemInfo.price.replace(',', ".");

        var mercadopago = require('mercadopago');
        mercadopago.configurations.setAccessToken(mercadoPago.token);
        var payment_data = {
            transaction_amount: Number(itemInfo.price),
            description: itemInfo.name,
            payment_method_id: 'pix',
            payer: {
                email: `${itemInfo.username}@pixel.com`,
                first_name: itemInfo.username,
                last_name: itemInfo.username,
                identification: {
                    number: '19119119100',
                    type: "CPF"
                },
            },
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
                    interaction.user.send({
                        content: "",
                        embeds: [new PixelEmbed({
                            author: 'Nova Compra',
                            description: 'Hey, voc?? est?? realizando uma compra dentro da Pixel! Vamos deixar algumas informa????es f??ceis aqui pra voc?? ok? :D Caso precise de suporte, envie uma print dessa mensagem para PewDizinho#3014',
                            fields: [
                                {
                                    name: "ID da compra", value:
                                        `\`\`\`${id.toString()}\`\`\``, inline: true
                                },
                                { name: "Pre??o", value: `\`\`\`${itemInfo.price.toString()}\`\`\``, inline: false },
                                { name: "Id do Comprador", value: `\`\`\`${interaction.user.id.toString()}\`\`\``, inline: true },
                                { name: "Nome do item", value: `\`\`\`${itemInfo.name.toString()}\`\`\``, inline: false },
                                { name: "Verifica????es", value: "\`\`\`Verifique o valor e o nome de quem est?? recebendo, Nome do remetente: Paulo Eduardo\`\`\`", inline: false },

                            ]
                        }).embed]
                    }).then(() => {
                        interaction.user.send({
                            content: "Aqui est?? o c??digo QR novamente caso voc?? precise ;D",
                            files: ['./assets/image.png'],
                        })
                    })
                    interaction.reply({
                        content: `<@${itemInfo.user}>`, files: ['./assets/image.png'], embeds: [new PixelEmbed({
                            author: `Pagamento N??: ${id}`,
                            description: "Escaneie o c??digo PIX acima e realize o pagamento",
                            fields: [
                                { name: "Ap??s o pagamento", value: "Execute /verificarcompra [ID] para atualizar o status da compra!", inline: false },
                                { name: "ID da compra", value: id.toString(), inline: true },
                                { name: "Verifica????es", value: "Verifique o valor e o nome de quem est?? recebendo, Nome do remetente: Paulo Eduardo", inline: false },
                                { name: "Erros ou D??vidas", value: "Quest??s de pagamento devem ser tratadas somente com <@409488966665109505>", inline: true },
                                { name: "Seguran??a", value: "N??o divulgue seu ID de compra com ningu??m al??m de <@409488966665109505>", inline: false },
                            ]
                        }).embed], ephemeral: true,
                    });

                    new CompradoresModel({
                        userId: interaction.user.id,
                        username: interaction.user.username,
                        userDiscriminator: interaction.user.discriminator,
                    }).addCompraPendente({
                        compraId: id,
                        price: itemInfo.price,
                        name: itemInfo.name.toString(),
                        qrCode: parsedData.point_of_interaction.transaction_data.qr_code_base64.split(';base64,').pop().toString(),
                    });


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
            resp.on('end', async () => {
                let parsedData = JSON.parse(data);
                if (parsedData.status == "approved") {
                    interaction.reply({
                        content: "",
                        embeds: [
                            new PixelEmbed({
                                author: "Compra aprovada!",
                                description: "Parab??ns! Sua compra foi confirmada! Um comprovante foi enviado para voc?? na sua DM junto com algumas instru????es!",
                            }).embed
                        ],
                        ephemeral: true,
                    });
                    const itemObj = new CompradoresModel({
                        userId: interaction.user.id,
                        username: interaction.user.username,
                        userDiscriminator: interaction.user.discriminator,
                    }).confirmarCompra(id);
                    //DOING
                    //Entregar o item para o comprador, pensar nesse sistema ainda

                    const itemInfo = await new ItemDataBase({
                        name: itemObj.name.split('-')[0],
                        price: itemObj.price
                    }).getItemByNameAndPrice;
                    console.log(itemInfo);
                    const itemDownloadUrl = new DataBase({
                        userId: itemInfo.authorId,
                        itemId: itemObj.name.split('-')[0]
                    }).getItem.downloadUrl;
                    new Payments({
                        price: itemObj.price,
                        authorId: itemInfo.authorId.toString()
                    }).addPendente();

                    interaction.user.send({
                        content: "",
                        embeds: [
                            new PixelEmbed({
                                author: `Comprovante de compra N?? ${id}`,
                                description: "Compra realizada e confirmada!",
                                fields: [
                                    { name: "Comprador", value: `\`\`\`${interaction.user.tag}\`\`\`` },
                                    { name: "Id do Comprador", value: `\`\`\`${interaction.user.id}\`\`\`` },
                                    { name: "Id da Compra", value: `\`\`\`${id}\`\`\`` },
                                    { name: "Download", value: itemDownloadUrl.toString() },
                                    { name: "Suporte", value: "Voc?? pode requerir suporte em at?? `7`(sete) dias a partir de agora e voc?? poder?? ter direito a reembolso caso o autor do produto n??o consiga resolver o problema dentro de `16` (dezesseis) dias ap??s ser notificado, ap??s os `7` (sete) dias n??o podemos garantir o reembolso" }
                                ]
                            }).embed
                        ]
                    })


                } else if (parsedData.status == "pending") {
                    interaction.reply({
                        content: "",
                        embeds: [
                            new PixelEmbed({
                                author: "Compra n??o aprovada",
                                description: "Hm, sua compra ainda n??o foi processada, tente novamente dentro de 5 minutos, caso n??o funcione, envie o comprovante para PewDizinho#3014"
                            }).embed
                        ],
                        ephemeral: true,
                    })
                };
                if (parsedData.error == 'not_found') {
                    interaction.reply({
                        content: "",
                        embeds: [
                            new PixelEmbed({
                                author: "Compra n??o localizada",
                                description: "Seu c??digo ?? inv??lido! Tente novamente.",
                                fields: [
                                    { name: "Aonde achar meu ID?", value: "Na hora que voc?? gerou o c??digo QR Code para o pagamento, uma mensagem foi enviada para voc?? na DM com o seu ID de compra, caso voc?? n??o tenha recebido, o c??digo pode ser achado no comprovamente do pagamento como \"Id de Transa????o\" ou \"Identificador\" (Apenas os n??meros)" },
                                    { name: "Ainda n??o estou conseguindo", value: "Entre em contato com PewDizinho#3014 com um comprovante do pagamento em m??os" }
                                ]
                            }).embed
                        ],
                        ephemeral: true
                    })
                }
            });
        })
    }
}
