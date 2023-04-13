"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const map_1 = require("rxjs/internal/operators/map");
const switchMap_1 = require("rxjs/internal/operators/switchMap");
const typedi_1 = require("typedi");
const logger_1 = __importDefault(require("../loaders/logger"));
// import { spawn } from 'rxjs-shell';
const childProcess = require('child_process');
const readline = require('readline');
const chalk = require('chalk');
// const { spawn } = require("child_process");
let ProjetService = class ProjetService {
    constructor() {
        this.fs = require('fs');
        this.distDirectory = './dist';
        this.projectName = 'my-project';
        this.projectDirectory = `${this.distDirectory}/${this.projectName}`;
        this.spawn = (command, args = [], options = {}) => rxjs_1.Observable.create((observer) => {
            const spawnee = childProcess.spawn(command, args, options);
            console.log(chalk `{white.bold ${command} ${args.join(' ')}}`);
            readline
                .createInterface({ input: spawnee.stdout, terminal: false })
                .on('line', line => logger_1.default.info(line));
            readline
                .createInterface({ input: spawnee.stderr, terminal: false })
                .on('line', line => console.error(chalk `{red ${line}}`));
            spawnee.on('close', (code) => {
                if (code === 0) {
                    observer.next();
                }
                else {
                    observer.error(new Error(`child process exited with code ${code}`));
                }
            });
        });
    }
    GénérationProjet() {
        logger_1.default.info(`GénérationProjet`);
        this.créerDossierDestinationEtLancerGénération();
    }
    créerDossierDestinationEtLancerGénération() {
        this.fs.rmdirSync(this.distDirectory, { recursive: true });
        this.fs.mkdir(this.distDirectory, () => {
            this.créerProjetAngular();
        });
    }
    créerProjetAngular() {
        var process = require('process');
        process.chdir(this.distDirectory);
        logger_1.default.info("[START] Création du projet Angular");
        /** Faire un tableau d'Observable */
        this.spawn(`ng.cmd`, [`new ${this.projectName} --skipInstall=true --routing=true --style=scss`], { shell: true })
            .pipe(map_1.map(() => {
            var process = require('process');
            process.chdir(`./${this.projectName}`);
            logger_1.default.info("[END] Création du projet Angular");
            logger_1.default.info("[START] Le schéma est en cours d'installation.");
        }), switchMap_1.switchMap(() => this.spawn(`npm`, [`i --save ..\\..\\lib\\my-component-0.0.4.tgz`], { shell: true })), map_1.map(() => {
            logger_1.default.info("[END] Le schéma est en cours d'installation.");
            logger_1.default.info("[START] Mise à jour template app.component.");
        }), switchMap_1.switchMap(() => this.spawn(`ng.cmd`, [`g my-component:my-component --name="Ma superbe application 3"`], { shell: true })), map_1.map(() => {
            logger_1.default.info("[END] Mise à jour template app.component.");
            logger_1.default.info("[START] Création page authentification.");
        }), switchMap_1.switchMap(() => this.spawn(`ng.cmd`, [`g my-component:page-component --name=authentification`], { shell: true })), map_1.map(() => {
            logger_1.default.info("[END] Création page authentification.");
            logger_1.default.info("[END] Projet Angular créé et initialisé.");
        })).subscribe();
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
};
ProjetService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], ProjetService);
exports.default = ProjetService;
//# sourceMappingURL=projet.service_ancien1.js.map