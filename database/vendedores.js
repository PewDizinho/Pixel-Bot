const { model, Schema } = require("mongoose");

module.exports = model("sellers", new Schema({
    UserId: String,
    User: Object,
    Info: Object,
    Itens: Array,
}));