import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';

import Logger from '../../loaders/logger';
import LotoService from '../../services/loto.service';

const rimraf = require("rimraf");
const fsPromises = require('fs').promises;
const path = require('path');
const fs = require('fs');

const route = Router();
const NUMBER_CARDS = 10

export default (app: Router) => {
  app.use('/loto', route);

  route.get(
    '/hello-world',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res.status(201).json({ message: "hello world loto" });
      } catch (e) {
        return next(e);
      }
    },
  );

  route.get(
    '/newDraw',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let drawsDatas: any[] = []

        const lotorService = Container.get(LotoService);

        Logger.debug(`New Draw...`);

        let pathFileDraws = __dirname + '/../../public/draws.json'

        if (!fs.existsSync(pathFileDraws)) {
          fs.writeFileSync(pathFileDraws, '[]');
        } else {
          let rawdata = fs.readFileSync(pathFileDraws);

          drawsDatas = JSON.parse(rawdata);
        }

        for (let index = 1; index <= NUMBER_CARDS; index++) {
          drawsDatas.push(lotorService.newCard())

          Logger.debug(`Index : ${index}`);
        }

        Logger.debug(`Grid length : ${drawsDatas.length}`);

        let data = JSON.stringify(drawsDatas);

        fs.writeFileSync(pathFileDraws, data);

        return res.status(201).json({ message: "Nouveau tirage" });

      } catch (e) {
        return next(e);
      }
    },
  );
};
