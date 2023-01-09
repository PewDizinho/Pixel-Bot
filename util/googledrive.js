
const { google } = require("googleapis");
const { googleDrive } = require("../config.json");
const fs = require('fs');
module.exports = {
    async uploadFile() {


        try {
            const auth = new google.auth.GoogleAuth({
                keyFile: '../GDCredenciais.json',
                scopes: ['https://www.googleapis.com/auth/drive']
            });

            const driveService = google.drive({
                version: "v3",
                auth
            });


            const fileMetaData = {
                'name': 'index.js',
                'parents': [googleDrive.folders.principal]
            };

            const media = {
                MimeType: 'application/javascript',
                body: fs.createReadStream('../index.js')
            };

            const response = await driveService.files.create({
                resource: fileMetaData,
                medi: media,
                fields: 'id'
            })
            return response.data.id;
        } catch (error) {
            console.log(error);

        }
    }
}