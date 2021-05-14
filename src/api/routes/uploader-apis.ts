import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';

import Logger from '../../loaders/logger';
import ProjetService from '../../services/projet.service';
import UploaderService from '../../services/uploader.service';

const rimraf = require("rimraf");
const fsPromises = require('fs').promises;
const path = require('path');
const fs = require('fs');

const route = Router();

export default (app: Router) => {
  app.use('/upload', route);

  route.get(
    '/hello-world',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res.status(201).json({ message: "hello world" });
      } catch (e) {
        return next(e);
      }
    },
  );


  route.post(
    '/file',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let path;
        const base64Content = req.body.base64Content;
        const numberParts: number = req.body.numberParts;
        const partIndex: number = req.body.partIndex || 0;
        let fileId: any = req.body.fileId;
        let pathFolderPart: string = '';
        let pathFolderPublic: string = `${__dirname}/../../public`;

        const uploaderService = Container.get(UploaderService);

        Logger.debug(`uploading the base64 file...`);

        if (!fileId) {
          fileId = Date.now()
        }

        pathFolderPart = `${pathFolderPublic}/${fileId}_parts`

        if (numberParts > 1 && !fs.existsSync(pathFolderPart)) {
          fs.mkdirSync(pathFolderPart);
        }

        if (numberParts > 1 || partIndex > 0) {
          path = `${pathFolderPart}/${uploaderService.pad(partIndex)}.part`
        } else {
          path = __dirname + '/../../public/' + fileId + '.png'
        }

        const base64Data = base64Content.replace(/^data:([A-Za-z-+/]+);base64,/, '');

        fs.writeFileSync(path, base64Data, { encoding: 'base64' });

        return res.status(201).json(fileId);
        //return res.status(500).json(fileId);
      } catch (e) {
        return next(e);
      }
    },
  );

  route.patch(
    '/file',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let path;
        const checksum: string = req.body.checksum;
        let fileId: any = req.body.fileId;

        let pathFolderPart: string = '';
        let pathFolderPublic: string = `${__dirname}/../../public`;

        const uploaderService = Container.get(UploaderService);

        console.log(req)

        Logger.debug(`patching the file... checksum: ${checksum}`);

        pathFolderPart = `${pathFolderPublic}/${fileId}_parts`;

        /** on recompose les parties de fichier */
        (async () => {
          const files: any[] = (await fsPromises.readdir(pathFolderPart)).filter(a => a.endsWith('.part'));
          const parts = [];

          files.sort()

          for (const file of files) {
            parts.push(await fsPromises.readFile(`${pathFolderPart}/${file}`));
          }

          await fsPromises.writeFile(`${pathFolderPublic}/${fileId}.png`, Buffer.concat(parts));

          await rimraf.sync(pathFolderPart);

          var buffer = await fs.readFileSync(`${pathFolderPublic}/${fileId}.png`, null).buffer;

          const checksumAllPart = uploaderService.checksum(buffer)

          if (checksumAllPart === checksum) {
            return res.status(201).json(fileId);
          } else throw new Error('checksum failed!')
        })().catch((e) => {
          console.log(e)
          return next(e);
        });

      } catch (e) {
        return next(e);
      }
    },
  );

  route.get(
    '/file/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const download = req.query.download;
        const fileId = req.params.id;

        Logger.debug(`downloading the file... ${fileId}`);

        const pathFile = __dirname + '/../../public/' + fileId + '.png'

        if (download === 'true') {
          return res.download(pathFile);
        } else {
          return res.sendFile(path.resolve(pathFile));
        }

      } catch (e) {
        return next(e);
      }
    },
  );

  route.post(
    '/genereProjet',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        Logger.debug(`génère projet ${JSON.stringify(req.body)}`);

        const authServiceInstance = Container.get(ProjetService);

        authServiceInstance.GénérationProjet(req.body);

        return res.status(201).json({ message: "cool" });
      } catch (e) {
        return next(e);
      }
    },
  );
};
