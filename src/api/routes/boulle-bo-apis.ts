import { NextFunction, Request, Response, Router } from 'express';

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
    '/header-menu',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let pathFileDraws = __dirname + '/../../public/ressources/boulle-bo/header-menu.json'

        let rawdata = fs.readFileSync(pathFileDraws);

        return res.status(201).json(JSON.parse(rawdata));

      } catch (e) {
        return next(e);
      }
    },
  );
};
