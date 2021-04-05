import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Service } from 'typedi';

import config from '../config';
import Logger from '../loaders/logger';
import { Page } from '../models/page.model';

const rmdir = require('rimraf');
const readline = require('readline');
const chalk = require('chalk');
const process = require('process');
const childProcess = require('child_process');

@Service()
export default class ProjetService {
    fs = require('fs');

    distDirectory = './dist';
    projectName = 'my-project';
    projectDirectory = `${this.distDirectory}/${this.projectName}`;
    configurationInterface: Page[];

    constructor() { }

    public GénérationProjet(données: any[]) {
        this.configurationInterface = données;

        Logger.info(`GénérationProjet`);

        // suppression du dossier de destination
        rmdir(this.distDirectory, function (error) {
            this.créerDossierDestinationEtLancerGénération();
        }.bind(this));
    }

    private créerDossierDestinationEtLancerGénération() {
        this.fs.mkdir(this.distDirectory, () => {
            this.créerProjetAngular();
        });
    }

    private créerProjetAngular() {
        process.chdir(this.distDirectory);

        const tableauCommandes = [
            { cmd: "ng.cmd", param: `new ${this.projectName} --skipInstall=true --routing=true --style=scss`, dirchange: false },
            { cmd: "npm", param: `i --save ..\\..\\lib\\${config.nomSchemaLibrairie}`, dirchange: true },
            { cmd: "ng.cmd", param: `g cocori-schematics-lib:app-component --name="Ma superbe application 6" --portDefautNgServe=${config.portNgServeProjetGénéré}`, dirchange: false },
        ];

        this.configurationInterface.forEach((page: Page) => {
            tableauCommandes.push({ cmd: "ng.cmd", param: `g cocori-schematics-lib:page-component --nomPage="${page.nomPage}" --urlPage="${page.urlPage}"`, dirchange: false });
        });

        const source$ = of(...tableauCommandes);

        const example = source$.pipe(
            concatMap(obj => {
                if (obj.dirchange) {
                    process.chdir(`./${this.projectName}`);
                }
                return this.spawn(obj.cmd, [obj.param], { shell: true })
            })
        );

        const subscribe = example.subscribe({
            next: value => console.log(value),
            error: err => console.error(err),
            complete: () => {
                Logger.info(`Génération du projet finie !`);
                process.chdir("../../");
            }
        });
    }

    private spawn = (command, args = [], options = {}) => Observable.create((observer) => {
        const spawnee = childProcess.spawn(command, args, options);
        console.log(chalk`{white.bold ${command} ${args.join(' ')}}`);

        readline
            .createInterface({ input: spawnee.stdout, terminal: false })
            .on('line', line => Logger.info(line))
            ;

        readline
            .createInterface({ input: spawnee.stderr, terminal: false })
            .on('line', line => console.error(chalk`{red ${line}}`))
            ;

        spawnee.on('close', (code) => {
            if (code === 0) {
                observer.complete();
                // observer.next();
            } else {
                observer.error(new Error(`child process exited with code ${code}`));
            }
        });
    });
}
