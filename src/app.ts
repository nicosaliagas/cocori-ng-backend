import 'reflect-metadata';

import express from 'express';

import config from './config';
import Logger from './loaders/logger';

// import ProjetService from './services/projet.service';

const https = require('https');

const fs = require('fs');

async function startServer() {
    const httpsOptions = {
        key: fs.readFileSync(__dirname +'/../security/key.pem'),
        cert: fs.readFileSync(__dirname +'/../security/cert.pem')
    };
    
    const app = express();

    await require('./loaders').default({ expressApp: app });

    /** Version HTTPS */

    https.createServer(httpsOptions, app)
    .listen(config.port, (err) => {
        if (err) {
            Logger.error(err);
            process.exit(1);
            return;
        }
        Logger.info(`Server Https listening on port: ${config.port}`);
    })

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
