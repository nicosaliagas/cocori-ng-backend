"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./express"));
const logger_1 = __importDefault(require("./logger"));
//We have to import at least all the events once so they can be triggered
const rimraf = require("rimraf");
const fs = require('fs');
exports.default = async ({ expressApp }) => {
    const pathFolderPublic = `${__dirname}/../public/tmp`;
    await express_1.default({ app: expressApp });
    /** suppression du dossier public avant de le recréer */
    await rimraf.sync(pathFolderPublic);
    fs.mkdirSync(pathFolderPublic);
    logger_1.default.info('✌️ Express loaded');
};
//# sourceMappingURL=index.js.map