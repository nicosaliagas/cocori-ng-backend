"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rimraf = require("rimraf");
const fsPromises = require('fs').promises;
const path = require('path');
const fs = require('fs');
const route = express_1.Router();
const NUMBER_CARDS = 10;
exports.default = (app) => {
    app.use('/cocoring-apis', route);
    route.get('/hello-world', async (req, res, next) => {
        try {
            return res.status(201).json({ message: "hello Boulle Cocoring Project APIs !" });
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/select-datasource', async (req, res, next) => {
        try {
            const datas = [{ id: "id-option1", nameOption: "Option 1" }, { id: "id-option2", nameOption: "Option 2" }, { id: "id-option3", nameOption: "Option 3" }];
            return res.status(201).json(datas);
        }
        catch (e) {
            return next(e);
        }
    });
};
//# sourceMappingURL=cocoring-apis.js.map