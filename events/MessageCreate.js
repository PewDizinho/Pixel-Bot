const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.channel.parentId != "1054100659718340649" || message.author.bot) return;
        // const channelname = message.channel.name.split('-');
        let otherChannel = message.guild.channels.cache.get("1054100659718340649").children.cache.find(channel => channel.name == message.channel.topic);

        // const webhook = new WebhookClient({ id: '1054116638858956841', token: 'YxISi_bDCpvD0eF_Ggs9MxCrc63es1cDB_4B9FEg77_dfULaCaevEYIJCP5xmpMhVE_Z' });


        if (otherChannel) {
            let image = [];
            let newImages = "\n\n```Imagens Enviadas```\n";
            message.attachments.map(attachment => { image.push(attachment.url); });
            for (var i of image) {
                newImages += `${i} - `;
            }
            otherChannel.createWebhook({
                name: "Chat com Vendedor - Anônimo - Não repasse informações",
                avatar: "https://cdn.discordapp.com/attachments/1052329282069872650/1052329371165274132/Pixel_Coin_Blue.png",
            }).then(wb => wb.send(`${(message.content ?? '')}  ${newImages}` ).then(() => wb.delete()));
        } else {
            message.channel.delete("Chat sem a outra metade da laranja");
        }

    },
};