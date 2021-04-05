import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Service } from 'typedi';

import Logger from '../loaders/logger';

// import { spawn } from 'rxjs-shell';
const childProcess = require('child_process');
const readline = require('readline');
const chalk = require('chalk');

// const { spawn } = require("child_process");
@Service()
export default class ProjetService {
    fs = require('fs');
    distDirectory = './dist';
    projectName = 'my-project';
    projectDirectory = `${this.distDirectory}/${this.projectName}`;

    constructor() { }

    public GénérationProjet() {
        Logger.info(`GénérationProjet`);

        this.créerDossierDestinationEtLancerGénération();
    }

    private créerDossierDestinationEtLancerGénération() {
        this.fs.rmdirSync(this.distDirectory, { recursive: true });

        this.fs.mkdir(this.distDirectory, () => {
            this.créerProjetAngular();
        });
    }

    private créerProjetAngular() {
        var process = require('process');

        process.chdir(this.distDirectory);

        Logger.info("[START] Création du projet Angular");

        /** Faire un tableau d'Observable */
        this.spawn(`ng.cmd`, [`new ${this.projectName} --skipInstall=true --routing=true --style=scss`], { shell: true })
            .pipe(
                map(() => {
                    var process = require('process');
                    process.chdir(`./${this.projectName}`);

                    Logger.info("[END] Création du projet Angular");
                    Logger.info("[START] Le schéma est en cours d'installation.");
                }),
                switchMap(() => this.spawn(`npm`, [`i --save ..\\..\\lib\\my-component-0.0.4.tgz`], { shell: true })),
                map(() => {
                    Logger.info("[END] Le schéma est en cours d'installation.");
                    Logger.info("[START] Mise à jour template app.component.");
                }),
                switchMap(() => this.spawn(`ng.cmd`, [`g my-component:my-component --name="Ma superbe application 3"`], { shell: true })),
                map(() => {
                    Logger.info("[END] Mise à jour template app.component.");
                    Logger.info("[START] Création page authentification.");
                }),
                switchMap(() => this.spawn(`ng.cmd`, [`g my-component:page-component --name=authentification`], { shell: true })),
                map(() => {
                    Logger.info("[END] Création page authentification.");
                    Logger.info("[END] Projet Angular créé et initialisé.");
                })
            ).subscribe();

        // this.exécuteCommande(`new ${this.projectName} --skipInstall=true --routing=true --style=scss`)
        //     .then(
        //         () => {
        //             Logger.info("[END] Création du projet Angular");

        //             var process = require('process');

        //             process.chdir(`./${this.projectName}`);

        //             Logger.info("[START] Le schéma est en cours d'installation.");

        //             this.exécuteCommande("i --save ..\\..\\lib\\my-component-0.0.4.tgz", "npm").then(
        //                 () => {
        //                     Logger.info("[END] Le schéma est en cours d'installation.");

        //                     Logger.info("[START] Mise à jour template app.component");

        //                     this.exécuteCommande('g my-component:my-component --name="Ma superbe application 2"').then(() => {
        //                         Logger.info("[END] Mise à jour template app.component.");

        //                         Logger.info("[START] Création page authentification.");

        //                         this.exécuteCommande('g my-component:page-component --name=authentification').then(() => {
        //                             Logger.info("[END] Création page authentification.");

        //                             Logger.info("[END] Création du projet Angular");
        //                         });
        //                     });
        //                 });
        //         });
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
                observer.next();
            } else {
                observer.error(new Error(`child process exited with code ${code}`));
            }
        });
    });

    // private async exécuteCommande(params: string, commande: string = "ng.cmd") {
    //     const child = await spawn(commande, [
    //         params
    //     ], { shell: true });

    //     for await (const data of child.stdout) {
    //         Logger.info(data);
    //     };

    //     for await (const data of child.stderr) {
    //         Logger.error(data);
    //     };

    //     // child.stdout.on('data', function (data) {
    //     //     Logger.info(data);
    //     // });

    //     // child.stderr.on('data', function (data) {
    //     //     Logger.error(data);
    //     // });

    //     // child.on('error', (error) => {
    //     //     console.log(`error: ${error.message}`);
    //     // });

    //     // child.on("close", code => {
    //     //     console.log("close");
    //     // });
    // }
}
