import { NextFunction, Request, Response, Router } from 'express';

const rimraf = require("rimraf");
const fsPromises = require('fs').promises;
const path = require('path');
const fs = require('fs');

const route = Router();
const NUMBER_CARDS = 10

export default (app: Router) => {
  app.use('/cocoring-apis', route);

  route.get(
    '/hello-world',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res.status(201).json({ message: "hello Boulle Cocoring Project APIs !" });
      } catch (e) {
        return next(e);
      }
    },
  );

  route.get(
    '/select-datasource',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const datas: any[] = [{ id: "id-option1", nameOption: "Option 1" }, { id: "id-option2", nameOption: "Option 2" }, { id: "id-option3", nameOption: "Option 3" }]

        return res.status(201).json(datas);
      } catch (e) {
        return next(e);
      }
    },
  );
};
