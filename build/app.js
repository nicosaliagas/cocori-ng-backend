"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./loaders/logger"));
// import ProjetService from './services/projet.service';
const https = require('https');
const fs = require('fs');
async function startServer() {
    const httpsOptions = {
        key: fs.readFileSync(__dirname + '/../security/key.pem'),
        cert: fs.readFileSync(__dirname + '/../security/cert.pem')
    };
    const app = express_1.default();
    await require('./loaders').default({ expressApp: app });
    /** Version HTTPS */
    https.createServer(httpsOptions, app)
        .listen(config_1.default.port, (err) => {
        if (err) {
            logger_1.default.error(err);
            process.exit(1);
            return;
        }
        logger_1.default.info(`Server Https listening on port: ${config_1.default.port}`);
    });
    /** Version HTTP */
    // app.listen(config.port, err => {
    //     if (err) {
    //         Logger.error(err);
    //         process.exit(1);
    //         return;
    //     }
    //     const authServiceInstance = Container.get(ProjetService);
    //     Logger.info(`Server listening on port: ${config.port}`);
    // });
}
startServer();
//# sourceMappingURL=app.js.map