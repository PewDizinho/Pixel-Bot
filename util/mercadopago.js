
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
                            description: 'Hey, você está realizando uma compra dentro da Pixel! Vamos deixar algumas informações fáceis aqui pra você ok? :D Caso precise de suporte, envie uma print dessa mensagem para PewDizinho#3014',
                            fields: [
                                {
                                    name: "ID da compra", value:
                                        `\`\`\`${id.toString()}\`\`\``, inline: true
                                },
                                { name: "Preço", value: `\`\`\`${itemInfo.price.toString()}\`\`\``, inline: false },
                                { name: "Id do Comprador", value: `\`\`\`${interaction.user.id.toString()}\`\`\``, inline: true },
                                { name: "Nome do item", value: `\`\`\`${itemInfo.name.toString()}\`\`\``, inline: false },
                                { name: "Verificações", value: "\`\`\`Verifique o valor e o nome de quem está recebendo, Nome do remetente: Paulo Eduardo\`\`\`", inline: false },

                            ]
                        }).embed]
                    }).then(() => {
                        interaction.user.send({
                            content: "Aqui está o código QR novamente caso você precise ;D",
                            files: ['./assets/image.png'],
                        })
                    })
                    interaction.reply({
                        content: `<@${itemInfo.user}>`, files: ['./assets/image.png'], embeds: [new PixelEmbed({
                            author: `Pagamento N°: ${id}`,
                            description: "Escaneie o código PIX acima e realize o pagamento",
                            fields: [
                                { name: "Após o pagamento", value: "Execute /verificarcompra [ID] para atualizar o status da compra!", inline: false },
                                { name: "ID da compra", value: id.toString(), inline: true },
                                { name: "Verificações", value: "Verifique o valor e o nome de quem está recebendo, Nome do remetente: Paulo Eduardo", inline: false },
                                { name: "Erros ou Dúvidas", value: "Questõs de pagamento devem ser tratadas somente com <@409488966665109505>", inline: true },
                                { name: "Segurança", value: "Não divulgue seu ID de compra com ninguém além de <@409488966665109505>", inline: false },
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
            resp.on('end', () => {
                let parsedData = JSON.parse(data);
                if (parsedData.status == "approved") {
                    interaction.reply({
                        content: "",
                        embeds: [
                            new PixelEmbed({
                                author: "Compra aprovada!",
                                description: "Parabéns! Sua compra foi confirmada! Um comprovante foi enviado para você na sua DM junto com algumas instruções!",
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

                    const itemInfo = new ItemDataBase({
                        name: itemObj.name.split('-')[0],
                        price: itemObj.price
                    }).getItemByNameAndPrice;

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
                                author: `Comprovante de compra N° ${id}`,
                                description: "Compra realizada e confirmada!",
                                fields: [
                                    { name: "Comprador", value: `\`\`\`${interaction.user.tag}\`\`\`` },
                                    { name: "Id do Comprador", value: `\`\`\`${interaction.user.id}\`\`\`` },
                                    { name: "Id da Compra", value: `\`\`\`${id}\`\`\`` },
                                    { name: "Download", value: itemDownloadUrl.toString() },
                                    { name: "Suporte", value: "Você pode requerir suporte em até `7`(sete) dias a partir de agora e você poderá ter direito a reembolso caso o autor do produto não consiga resolver o problema dentro de `16` (dezesseis) dias após ser notificado, após os `7` (sete) dias não podemos garantir o reembolso" }
                                ]
                            }).embed
                        ]
                    })


                } else if (parsedData.status == "pending") {
                    interaction.reply({
                        content: "",
                        embeds: [
                            new PixelEmbed({
                                author: "Compra não aprovada",
                                description: "Hm, sua compra ainda não foi processada, tente novamente dentro de 5 minutos, caso não funcione, envie o comprovante para PewDizinho#3014"
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
                                author: "Compra não localizada",
                                description: "Seu código é inválido! Tente novamente.",
                                fields: [
                                    { name: "Aonde achar meu ID?", value: "Na hora que você gerou o código QR Code para o pagamento, uma mensagem foi enviada para você na DM com o seu ID de compra, caso você não tenha recebido, o código pode ser achado no comprovamente do pagamento como \"Id de Transação\" ou \"Identificador\" (Apenas os números)" },
                                    { name: "Ainda não estou conseguindo", value: "Entre em contato com PewDizinho#3014 com um comprovante do pagamento em mãos" }
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
