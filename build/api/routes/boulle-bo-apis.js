"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const logger_1 = __importDefault(require("../../loaders/logger"));
const helper_service_1 = __importDefault(require("../../services/helper.service"));
const rimraf = require("rimraf");
const fsPromises = require('fs').promises;
const path = require('path');
const fs = require('fs');
const route = express_1.Router();
const NUMBER_CARDS = 10;
exports.default = (app) => {
    app.use('/boulle-bo', route);
    route.get('/hello-world', async (req, res, next) => {
        try {
            return res.status(201).json({ message: "hello Boulle BO !" });
        }
        catch (e) {
            return next(e);
        }
    });
    /** Bo Menu */
    route.get('/getmenu/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            let pathFile = __dirname + '/../../public/ressources/boulle-bo/menu.json';
            let rawdata = fs.readFileSync(pathFile);
            const datas = JSON.parse(rawdata);
            const menu = datas.find((menu) => menu.id === id);
            return res.status(201).json(menu);
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/menu', async (req, res, next) => {
        try {
            let pathFileDraws = __dirname + '/../../public/ressources/boulle-bo/menu.json';
            let rawdata = fs.readFileSync(pathFileDraws);
            return res.status(201).json(JSON.parse(rawdata));
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/menu-odata', async (req, res, next) => {
        try {
            const pathFileDraws = __dirname + '/../../public/ressources/boulle-bo/menu.json';
            const rawdata = JSON.parse(fs.readFileSync(pathFileDraws));
            return res.status(201).json({ d: { __count: rawdata.length, results: rawdata } });
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/menu', async (req, res, next) => {
        try {
            const { label, linkTo } = req.body;
            let menuEntries = [];
            logger_1.default.debug(`ajout d'une entrée de menu...`);
            let pathFile = __dirname + '/../../public/ressources/boulle-bo/menu.json';
            if (!fs.existsSync(pathFile)) {
                fs.writeFileSync(pathFile, '[]');
            }
            else {
                let datas = fs.readFileSync(pathFile);
                menuEntries = JSON.parse(datas);
            }
            const helperServiceInstance = typedi_1.Container.get(helper_service_1.default);
            /** génération, d'un id pour le menu créé */
            menuEntries.push({ id: helperServiceInstance.generateGuid(), label: label, linkTo: linkTo });
            fs.writeFileSync(pathFile, JSON.stringify(menuEntries));
            let rawdata = fs.readFileSync(pathFile);
            return res.status(201).json(JSON.parse(rawdata));
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/updatemenu/:id', async (req, res, next) => {
        try {
            const { label, linkTo } = req.body;
            const id = req.params.id;
            let pathFile = __dirname + '/../../public/ressources/boulle-bo/menu.json';
            logger_1.default.debug(`édition d'une entrée de menu...`);
            let rawdata = fs.readFileSync(pathFile);
            const datas = JSON.parse(rawdata);
            const menuToUpdate = datas.find((menu) => menu.id === id);
            menuToUpdate.label = label;
            menuToUpdate.linkTo = linkTo;
            fs.writeFileSync(pathFile, JSON.stringify(datas));
            return res.status(201).json(true);
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/deletemenus', async (req, res, next) => {
        try {
            const idsMenus = req.body;
            let pathFile = __dirname + '/../../public/ressources/boulle-bo/menu.json';
            logger_1.default.debug(`suppression d'une entrée de menu...`);
            let rawdata = fs.readFileSync(pathFile);
            const datas = JSON.parse(rawdata);
            idsMenus.forEach((idMenu) => {
                const indexToDelete = datas.findIndex((menuDatabase) => menuDatabase.id === idMenu);
                if (indexToDelete !== -1) {
                    datas.splice(indexToDelete, 1);
                }
            });
            fs.writeFileSync(pathFile, JSON.stringify(datas));
            return res.status(201).json(true);
        }
        catch (e) {
            return next(e);
        }
    });
    /** Bo / Menu */
    /** Bo Pages */
    route.get('/pages-odata', async (req, res, next) => {
        try {
            const pathFileDraws = __dirname + '/../../public/ressources/boulle-bo/pages.json';
            const rawdata = JSON.parse(fs.readFileSync(pathFileDraws));
            return res.status(201).json({ d: { __count: rawdata.length, results: rawdata } });
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/addpage', async (req, res, next) => {
        try {
            const { pageName, menuId, pageCms } = req.body;
            let pages = [];
            logger_1.default.debug(`ajout d'une nouvelle page...`);
            let pathFile = __dirname + '/../../public/ressources/boulle-bo/pages.json';
            if (!fs.existsSync(pathFile)) {
                fs.writeFileSync(pathFile, '[]');
            }
            else {
                let datas = fs.readFileSync(pathFile);
                pages = JSON.parse(datas);
            }
            const helperServiceInstance = typedi_1.Container.get(helper_service_1.default);
            const newIdPage = helperServiceInstance.generateGuid();
            pages.push({ id: newIdPage, pageName: pageName, menuId: menuId, pageCms: JSON.stringify(pageCms), menu: '??' });
            fs.writeFileSync(pathFile, JSON.stringify(pages));
            let rawdata = fs.readFileSync(pathFile);
            return res.status(201).json(newIdPage);
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/getpage/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            let pathFile = __dirname + '/../../public/ressources/boulle-bo/pages.json';
            let rawdata = fs.readFileSync(pathFile);
            const datas = JSON.parse(rawdata);
            const menu = datas.find((page) => page.id === id);
            return res.status(201).json(menu);
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/getpageByMenu/:menuid', async (req, res, next) => {
        try {
            const menuId = req.params.menuid;
            let pathFile = __dirname + '/../../public/ressources/boulle-bo/pages.json';
            let rawdata = fs.readFileSync(pathFile);
            const datas = JSON.parse(rawdata);
            const page = datas.find((page) => page.menuId === menuId);
            return res.status(201).json(page);
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/updatePageInformations/:id', async (req, res, next) => {
        try {
            const { pageName, menuId } = req.body;
            const id = req.params.id;
            let pathFile = __dirname + '/../../public/ressources/boulle-bo/pages.json';
            logger_1.default.debug(`édition d'une page...`);
            let rawdata = fs.readFileSync(pathFile);
            const datas = JSON.parse(rawdata);
            const menuToUpdate = datas.find((menu) => menu.id === id);
            menuToUpdate.pageName = pageName;
            menuToUpdate.menuId = menuId;
            fs.writeFileSync(pathFile, JSON.stringify(datas));
            return res.status(201).json(true);
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/updateDesignPage/:id', async (req, res, next) => {
        try {
            const { designCmsPage } = req.body;
            const id = req.params.id;
            let pathFile = __dirname + '/../../public/ressources/boulle-bo/pages.json';
            logger_1.default.debug(`save design de la page cms...`);
            let rawdata = fs.readFileSync(pathFile);
            const datas = JSON.parse(rawdata);
            const menuToUpdate = datas.find((menu) => menu.id === id);
            menuToUpdate.pageCms = JSON.stringify(designCmsPage);
            fs.writeFileSync(pathFile, JSON.stringify(datas));
            return res.status(201).json(true);
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/deletepages', async (req, res, next) => {
        try {
            const idsMenus = req.body;
            let pathFile = __dirname + '/../../public/ressources/boulle-bo/pages.json';
            logger_1.default.debug(`suppression d'une page...`);
            let rawdata = fs.readFileSync(pathFile);
            const datas = JSON.parse(rawdata);
            idsMenus.forEach((idMenu) => {
                const indexToDelete = datas.findIndex((menuDatabase) => menuDatabase.id === idMenu);
                if (indexToDelete !== -1) {
                    datas.splice(indexToDelete, 1);
                }
            });
            fs.writeFileSync(pathFile, JSON.stringify(datas));
            return res.status(201).json(true);
        }
        catch (e) {
            return next(e);
        }
    });
    /** / Bo Pages */
};
//# sourceMappingURL=boulle-bo-apis.js.map