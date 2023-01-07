const { EmbedBuilder } = require('discord.js');
const { defaultFooter } = require("../config.json");
module.exports = class PixelEmbed {

    constructor({ author, description, image, thumbnail, footer, link, fields, title }) {
        this.author = author;
        this.description = description;
        this.image = image;
        this.thumbnail = thumbnail;
        this.footer = footer;
        this.link = link;
        this.fields = fields;
        this.title = title;

    }
    get embed() {
        const embed = new EmbedBuilder()
            .setAuthor({ name: this.author, iconURL: this.assetLink("coin_blue") })
            .setColor(0x0099FF)
            .setDescription(this.description)
            .setFooter(this.footer ?? defaultFooter)
            .setTimestamp()
            .setFields(this.fields ?? [])
            ;

        if (this.title) {
            embed.setTitle(this.title)
        }
        if (this.thumbnail) {
            embed.setThumbnail(this.assetLink(this.thumbnail) ?? this.thumbnail);
        }
        if (this.image) {
            embed.setImage(this.assetLink(this.image) ?? this.image);
        }


        return embed;
    }

    assetLink(name) {
        let link = false;
        switch (name) {
            case "pixel_community":
                link = "https://cdn.discordapp.com/attachments/1052329282069872650/1052329369890205787/Pixel_Community.png";
                break;
            case "pixel_store":
                link = "https://cdn.discordapp.com/attachments/1052329282069872650/1052329370305450115/Pixel_Store.png";
                break;
            case "coin_pink":
                link = "https://cdn.discordapp.com/attachments/1052329282069872650/1052329370758418552/Pixel_Coin_Pink.png";
                break;
            case "coin_blue":
                link = "https://cdn.discordapp.com/attachments/1052329282069872650/1052329371165274132/Pixel_Coin_Blue.png";
                break;
            case "coin_green":
                link = "https://cdn.discordapp.com/attachments/1052329282069872650/1052329371542769814/Pixel_Coin_Green.png";
                break;
        }
        return link;
    }
}