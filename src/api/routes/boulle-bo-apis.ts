import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';

import Logger from '../../loaders/logger';
import HelperService from '../../services/helper.service';

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

  /** Bo Menu */

  route.get(
    '/getmenu/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params.id;

        let pathFile = __dirname + '/../../public/ressources/boulle-bo/menu.json'

        let rawdata = fs.readFileSync(pathFile);

        const datas: any[] = JSON.parse(rawdata)

        const menu = datas.find((menu: any) => menu.id === id)

        return res.status(201).json(menu);
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
        const { label, linkTo } = req.body
        let menuEntries: any[] = []

        Logger.debug(`ajout d'une nouvelle entrée de menu...`);

        let pathFile = __dirname + '/../../public/ressources/boulle-bo/menu.json'

        if (!fs.existsSync(pathFile)) {
          fs.writeFileSync(pathFile, '[]');
        } else {
          let datas = fs.readFileSync(pathFile);

          menuEntries = JSON.parse(datas);
        }

        const helperServiceInstance = Container.get(HelperService);

        /** génération, d'un id pour le menu créé */
        menuEntries.push({ id: helperServiceInstance.generateGuid(), label: label, linkTo: linkTo })

        fs.writeFileSync(pathFile, JSON.stringify(menuEntries));

        let rawdata = fs.readFileSync(pathFile);

        return res.status(201).json(JSON.parse(rawdata));

      } catch (e) {
        return next(e);
      }
    },
  );

  route.post(
    '/updatemenu/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { label, linkTo } = req.body
        const id = req.params.id;

        let pathFile = __dirname + '/../../public/ressources/boulle-bo/menu.json'

        Logger.debug(`édition d'une nouvelle entrée de menu...`);

        let rawdata = fs.readFileSync(pathFile);

        const datas: any[] = JSON.parse(rawdata)

        const menuToUpdate = datas.find((menu: any) => menu.id === id)

        menuToUpdate.label = label
        menuToUpdate.linkTo = linkTo

        fs.writeFileSync(pathFile, JSON.stringify(datas));

        return res.status(201).json(true);

      } catch (e) {
        return next(e);
      }
    },
  );

  route.post(
    '/deletemenus',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const idsMenus: string[] = req.body

        let pathFile = __dirname + '/../../public/ressources/boulle-bo/menu.json'

        Logger.debug(`suppression des nouvelles entrées de menu...`);

        let rawdata = fs.readFileSync(pathFile);

        const datas: any[] = JSON.parse(rawdata)

        idsMenus.forEach((idMenu: string) => {
          const indexToDelete: number = datas.findIndex((menuDatabase: any) => menuDatabase.id === idMenu)

          if (indexToDelete !== -1) {
            datas.splice(indexToDelete, 1)
          }
        })

        fs.writeFileSync(pathFile, JSON.stringify(datas));

        return res.status(201).json(true);

      } catch (e) {
        return next(e);
      }
    },
  );

  /** Bo / Menu */

  /** Bo Pages */

  route.get(
    '/pages-odata',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const pathFileDraws = __dirname + '/../../public/ressources/boulle-bo/pages.json'

        const rawdata: any[] = JSON.parse(fs.readFileSync(pathFileDraws));

        return res.status(201).json({ __count: rawdata.length, results: rawdata });

      } catch (e) {
        return next(e);
      }
    },
  );

  /** / Bo Pages */

};
