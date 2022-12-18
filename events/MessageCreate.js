const { Events, WebhookClien, Webhook } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.channel.parentId != "1054100659718340649" || message.author.bot) return;
        // const channelname = message.channel.name.split('-');
        let otherChannel = message.guild.channels.cache.get("1054100659718340649").children.cache.find(channel => channel.name == message.channel.topic);

        // const webhook = new WebhookClient({ id: '1054116638858956841', token: 'YxISi_bDCpvD0eF_Ggs9MxCrc63es1cDB_4B9FEg77_dfULaCaevEYIJCP5xmpMhVE_Z' });


        if (otherChannel) {
            otherChannel.createWebhook({
                name: message.author.username,
                avatar: message.author.avatarUrl,
            }).then(wb => wb.send(message.content).then(() => wb.delete()));
        } else {
            message.channel.delete("Chat sem a outra metade da laranja");
        }

    },
};