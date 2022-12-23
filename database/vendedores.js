const { model, Schema } = require("mongoose");

module.exports = model("vendedores_teste", new Schema({
    UserId: String,
    User: Object,
    Info: Object,
    Itens: Array,
}));