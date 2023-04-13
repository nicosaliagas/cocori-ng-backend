"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const logger_1 = __importDefault(require("../../loaders/logger"));
const projet_service_1 = __importDefault(require("../../services/projet.service"));
const uploader_service_1 = __importDefault(require("../../services/uploader.service"));
const rimraf = require("rimraf");
const fsPromises = require('fs').promises;
const path = require('path');
const fs = require('fs');
const route = express_1.Router();
const tmp = 'tmp';
exports.default = (app) => {
    app.use('/upload', route);
    route.get('/hello-world', async (req, res, next) => {
        try {
            return res.status(201).json({ message: "hello world upload" });
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/file', async (req, res, next) => {
        try {
            let path;
            const base64Content = req.body.base64Content;
            const numberParts = req.body.numberParts;
            const partIndex = req.body.partIndex || 0;
            let fileId = req.body.fileId;
            let pathFolderPart = '';
            let pathFolderPublic = `${__dirname}/../../public/${tmp}/`;
            const uploaderService = typedi_1.Container.get(uploader_service_1.default);
            logger_1.default.debug(`uploading the base64 file...`);
            if (!fileId) {
                fileId = Date.now();
            }
            pathFolderPart = `${pathFolderPublic}/${fileId}_parts`;
            if (numberParts > 1 && !fs.existsSync(pathFolderPart)) {
                fs.mkdirSync(pathFolderPart);
            }
            if (numberParts > 1 || partIndex > 0) {
                path = `${pathFolderPart}/${uploaderService.pad(partIndex)}.part`;
            }
            else {
                path = __dirname + `/../../public/${tmp}/` + fileId + '.png';
            }
            const base64Data = base64Content.replace(/^data:([A-Za-z-+/]+);base64,/, '');
            fs.writeFileSync(path, base64Data, { encoding: 'base64' });
            return res.status(201).json(fileId);
            // return res.status(500).json(fileId);
        }
        catch (e) {
            return next(e);
        }
    });
    route.patch('/file', async (req, res, next) => {
        try {
            let path;
            const checksum = req.body.checksum;
            let fileId = req.body.fileId;
            let pathFolderPart = '';
            let pathFolderPublic = `${__dirname}/../../public/${tmp}`;
            const uploaderService = typedi_1.Container.get(uploader_service_1.default);
            console.log(req);
            logger_1.default.debug(`patching the file... checksum: ${checksum}`);
            pathFolderPart = `${pathFolderPublic}/${fileId}_parts`;
            /** on recompose les parties de fichier */
            (async () => {
                const files = (await fsPromises.readdir(pathFolderPart)).filter(a => a.endsWith('.part'));
                const parts = [];
                files.sort();
                for (const file of files) {
                    parts.push(await fsPromises.readFile(`${pathFolderPart}/${file}`));
                }
                await fsPromises.writeFile(`${pathFolderPublic}/${fileId}.png`, Buffer.concat(parts));
                await rimraf.sync(pathFolderPart);
                var buffer = await fs.readFileSync(`${pathFolderPublic}/${fileId}.png`, null).buffer;
                const checksumAllPart = uploaderService.checksum(buffer);
                if (checksumAllPart === checksum) {
                    return res.status(201).json(fileId);
                }
                else
                    throw new Error('checksum failed!');
            })().catch((e) => {
                console.log(e);
                return next(e);
            });
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/image/:filename', async (req, res, next) => {
        try {
            const download = req.query.download;
            const fileName = req.params.filename;
            const pathFile = __dirname + `/../../public/images/` + fileName;
            if (download === 'true') {
                return res.download(pathFile);
            }
            else {
                return res.sendFile(path.resolve(pathFile));
            }
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/file/:id', async (req, res, next) => {
        try {
            const download = req.query.download;
            const fileId = req.params.id;
            logger_1.default.debug(`downloading the file... ${fileId}`);
            const pathFile = __dirname + `/../../public/${tmp}/` + fileId + '.png';
            if (download === 'true') {
                return res.download(pathFile);
            }
            else {
                return res.sendFile(path.resolve(pathFile));
            }
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/genereProjet', async (req, res, next) => {
        try {
            logger_1.default.debug(`génère projet ${JSON.stringify(req.body)}`);
            const authServiceInstance = typedi_1.Container.get(projet_service_1.default);
            authServiceInstance.GénérationProjet(req.body);
            return res.status(201).json({ message: "cool" });
        }
        catch (e) {
            return next(e);
        }
    });
};
//# sourceMappingURL=uploader-apis.js.map