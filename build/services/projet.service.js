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
const operators_1 = require("rxjs/operators");
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../loaders/logger"));
const rmdir = require('rimraf');
const readline = require('readline');
const chalk = require('chalk');
const process = require('process');
const childProcess = require('child_process');
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
                    observer.complete();
                    // observer.next();
                }
                else {
                    observer.error(new Error(`child process exited with code ${code}`));
                }
            });
        });
    }
    GénérationProjet(données) {
        this.configurationInterface = données;
        logger_1.default.info(`GénérationProjet`);
        // suppression du dossier de destination
        rmdir(this.distDirectory, function (error) {
            this.créerDossierDestinationEtLancerGénération();
        }.bind(this));
    }
    créerDossierDestinationEtLancerGénération() {
        this.fs.mkdir(this.distDirectory, () => {
            this.créerProjetAngular();
        });
    }
    créerProjetAngular() {
        process.chdir(this.distDirectory);
        const tableauCommandes = [
            { cmd: "ng.cmd", param: `new ${this.projectName} --skipInstall=true --routing=true --style=scss`, dirchange: false },
            { cmd: "npm", param: `i --save ..\\..\\lib\\${config_1.default.nomSchemaLibrairie}`, dirchange: true },
            { cmd: "ng.cmd", param: `g cocori-schematics-lib:app-component --name="Ma superbe application 6" --portDefautNgServe=${config_1.default.portNgServeProjetGénéré}`, dirchange: false },
        ];
        this.configurationInterface.forEach((page) => {
            tableauCommandes.push({ cmd: "ng.cmd", param: `g cocori-schematics-lib:page-component --nomPage="${page.nomPage}" --urlPage="${page.urlPage}"`, dirchange: false });
        });
        const source$ = rxjs_1.of(...tableauCommandes);
        const example = source$.pipe(operators_1.concatMap(obj => {
            if (obj.dirchange) {
                process.chdir(`./${this.projectName}`);
            }
            return this.spawn(obj.cmd, [obj.param], { shell: true });
        }));
        const subscribe = example.subscribe({
            next: value => console.log(value),
            error: err => console.error(err),
            complete: () => {
                logger_1.default.info(`Génération du projet finie !`);
                process.chdir("../../");
            }
        });
    }
};
ProjetService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], ProjetService);
exports.default = ProjetService;
//# sourceMappingURL=projet.service.js.map