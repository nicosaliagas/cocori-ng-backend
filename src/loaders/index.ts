import expressLoader from './express';
import Logger from './logger';

//We have to import at least all the events once so they can be triggered
const rimraf = require("rimraf");
const fs = require('fs');

export default async ({ expressApp }) => {
    const pathFolderPublic: string = `${__dirname}/../public/tmp`;

    await expressLoader({ app: expressApp });

    /** suppression du dossier public avant de le recréer */

    await rimraf.sync(pathFolderPublic);

    fs.mkdirSync(pathFolderPublic);

    Logger.info('✌️ Express loaded');
};
