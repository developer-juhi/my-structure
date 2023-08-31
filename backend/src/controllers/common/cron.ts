const fs = require("fs");
const log4js = require("log4js");
const logger = log4js.getLogger();
import { exec } from "child_process";
import moment from "moment";
import commonFunction from "../../helper/commonFunction";
import AdminToken from "../../models/admin-token-model";
import UserToken from "../../models/user-token-model";
const archiver = require('archiver');


const destroyToken = async () => {
    try {
        var date = new Date();
        date.setDate(date.getDate() - 1);
        await AdminToken.deleteMany({
            createdAt: { $lte: date },
        });
        await UserToken.deleteMany({
            createdAt: { $lte: date },
        });

        return;
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("destroyToken");
        logger.info(sendResponse);
    }
};
const removeLogger = async () => {
    try {
        var uploadsDir = __dirname + "/logger";
        fs.rmdir(uploadsDir, { recursive: true }, (err: any) => {
            if (err) {
                throw err;
            }
            console.log(`${uploadsDir} is deleted!`);
        });

        return;
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("removeLogger");
        logger.info(sendResponse);
    }
};

const databaseBackup = async () => {
    const mongodbUri = process.env.MONGO_URI; // db url
    const backupPath = `${process.cwd() + '/src/database/'}`;
    const currentDate = moment().format("MM-DD-YYYY--HH-mm-ss-a")
    const backupFile = `backup-${currentDate}.zip`;
    const cmd = `mongodump --uri=${mongodbUri} --out=${backupPath} && zip -r ${backupFile} ${backupPath}`;

    exec(cmd, async (error: any) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    })

    try {
        const output = fs.createWriteStream(backupPath + backupFile);
        const archive = archiver('zip', {
            zlib: { level: 9 } // compression level
        });

        archive.directory(backupPath + 'live-maintenance-master', false);

        await sendEmailDatabase(backupFile, backupPath)

        output.on('close', async () => {
            console.log('Zip file created successfully!');
        });

        archive.pipe(output);
        archive.finalize();


    } catch (error: any) {
        console.log('errrr', error)
    }


}

const sendEmailDatabase = async (backupFiles: any, backupPaths: any) => {


    let backupFile: any = backupFiles
    let backupPath: any = backupPaths
    let template: any = 'database'

    let datta: any = {
        to: 'abhishekg.ebiz@gmail.com',
        subject: 'database backup',
        template: template,
        sendEmailTemplatedata: {
            app_name: process.env.APP_NAME,
            attachment : backupPath + backupFile,
            filename:"Database"
        },
        
        attachments: 
            {
                filename: backupFile,
                path: backupPath + backupFile,
            }
        
    }
    await commonFunction.sendEmailTemplate(datta)

}

export default {
    destroyToken,
    removeLogger,
    databaseBackup
};
