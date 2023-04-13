"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const logger_1 = __importDefault(require("../../loaders/logger"));
const loto_service_1 = __importDefault(require("../../services/loto.service"));
const rimraf = require("rimraf");
const fsPromises = require('fs').promises;
const path = require('path');
const fs = require('fs');
const route = express_1.Router();
const NUMBER_CARDS = 10;
exports.default = (app) => {
    app.use('/loto', route);
    route.get('/hello-world', async (req, res, next) => {
        try {
            return res.status(201).json({ message: "hello world loto" });
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/newDraw', async (req, res, next) => {
        try {
            let drawsDatas = [];
            const lotorService = typedi_1.Container.get(loto_service_1.default);
            logger_1.default.debug(`New Draw...`);
            let pathFileDraws = __dirname + '/../../public/draws.json';
            if (!fs.existsSync(pathFileDraws)) {
                fs.writeFileSync(pathFileDraws, '[]');
            }
            else {
                let rawdata = fs.readFileSync(pathFileDraws);
                drawsDatas = JSON.parse(rawdata);
            }
            for (let index = 1; index <= NUMBER_CARDS; index++) {
                drawsDatas.push(lotorService.newCard());
                logger_1.default.debug(`Index : ${index}`);
            }
            logger_1.default.debug(`Grid length : ${drawsDatas.length}`);
            let data = JSON.stringify(drawsDatas);
            fs.writeFileSync(pathFileDraws, data);
            return res.status(201).json({ message: "Nouveau tirage" });
        }
        catch (e) {
            return next(e);
        }
    });
};
//# sourceMappingURL=loto-apis.js.map