import 'reflect-metadata';

import express from 'express';
import { Container } from 'typedi/Container';

import config from './config';
import Logger from './loaders/logger';
import ProjetService from './services/projet.service';


async function startServer() {
    const app = express();

    await require('./loaders').default({ expressApp: app });

    app.listen(config.port, err => {
        if (err) {
            Logger.error(err);
            process.exit(1);
            return;
        }

        const authServiceInstance = Container.get(ProjetService);

        Logger.info(`Server listening on port: ${config.port}`);
    });
}

startServer();
