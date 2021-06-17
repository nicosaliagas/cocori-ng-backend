import { NextFunction, Request, Response, Router } from 'express';

import Logger from '../../loaders/logger';

const rimraf = require("rimraf");
const fsPromises = require('fs').promises;
const path = require('path');
const fs = require('fs');

const route = Router();
const NUMBER_CARDS = 10

export default (app: Router) => {
  app.use('/boulle-bo', route);

  route.get(
    '/hello-world',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res.status(201).json({ message: "hello Boulle BO !" });
      } catch (e) {
        return next(e);
      }
    },
  );

  route.get(
    '/menu',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let pathFileDraws = __dirname + '/../../public/ressources/boulle-bo/menu.json'

        let rawdata = fs.readFileSync(pathFileDraws);

        return res.status(201).json(JSON.parse(rawdata));

      } catch (e) {
        return next(e);
      }
    },
  );

  route.get(
    '/menu-odata',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const pathFileDraws = __dirname + '/../../public/ressources/boulle-bo/menu.json'

        const rawdata: any[] = JSON.parse(fs.readFileSync(pathFileDraws));

        return res.status(201).json({ __count: rawdata.length, results: rawdata });

      } catch (e) {
        return next(e);
      }
    },
  );

  route.post(
    '/menu',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { nom, url } = req.body
        let menuEntries: any[] = []

        Logger.debug(`ajout d'une nouvelle entrée de menu...`);

        let pathFile = __dirname + '/../../public/ressources/boulle-bo/menu.json'

        if (!fs.existsSync(pathFile)) {
          fs.writeFileSync(pathFile, '[]');
        } else {
          let datas = fs.readFileSync(pathFile);

          menuEntries = JSON.parse(datas);
        }

        menuEntries.push({ label: nom, linkTo: url })

        fs.writeFileSync(pathFile, JSON.stringify(menuEntries));

        let rawdata = fs.readFileSync(pathFile);

        return res.status(201).json(JSON.parse(rawdata));

      } catch (e) {
        return next(e);
      }
    },
  );
};
