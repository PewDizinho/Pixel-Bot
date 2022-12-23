const { model, Schema } = require("mongoose");

module.exports = model("test", new Schema({
    UserId: String,
    Edit: String
}));