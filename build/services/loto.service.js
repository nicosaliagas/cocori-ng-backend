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
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let LotoService = class LotoService {
    constructor() {
        this.totalCasesGrid = 90;
        this.totalNumbersGrid = 15;
        this.totalNumbersRow = 5;
        this.totalNumbersCol = 2;
        /** sac de numéros à tirer */
        this.bag = {};
        /** grille résultat */
        this.grid = {};
        // lignes complètes : 5 numéros
        this.full_rows = [];
        // colonnes pleines : 2 numéros
        this.full_cols = [];
    }
    newCard() {
        this.grid = { 1: {}, 2: {}, 3: {} };
        this.bag = {};
        for (let index = 1; index <= this.totalCasesGrid; index++) {
            this.bag[index] = 0;
        }
        this.full_rows.splice(0, this.full_rows.length);
        this.full_cols.splice(0, this.full_cols.length);
        return this.generateCardNumbers();
    }
    generateCardNumbers() {
        let numberPlaced = 0;
        let col = 0;
        let row = 0;
        while (numberPlaced < this.totalNumbersGrid) {
            // on tire un numéro et on le retire du sac
            const numberPicked = this.pickrandomNumberFromBag();
            this.removeNumberFromBag(numberPicked);
            if (numberPicked < 10) {
                col = 1;
            }
            else if (numberPicked < this.totalCasesGrid) {
                col = parseInt(numberPicked.toString()[0]) + 1;
            }
            else {
                col = 9;
            }
            if (this.full_cols.findIndex(element => element === col) !== -1) {
                continue;
            }
            const diffArray = [1, 2, 3].concat(this.full_rows).filter(function (e, i, array) {
                // Check if the element is appearing only once
                return array.indexOf(e) === array.lastIndexOf(e);
            });
            let rows = [];
            diffArray.forEach(val => {
                if (!this.grid[val][col]) {
                    rows.push(val);
                }
            });
            if (!rows.length) {
                continue;
            }
            row = rows[0];
            this.grid[row][col] = numberPicked;
            numberPlaced++;
            if (Object.keys(this.grid[row]).length === this.totalNumbersRow) {
                this.full_rows.push(row);
            }
            const numbersPickedCol = (this.grid[1][col] ? 1 : 0) + (this.grid[2][col] ? 1 : 0) + (this.grid[3][col] ? 1 : 0);
            if (numbersPickedCol === this.totalNumbersCol) {
                this.full_cols.push(col);
            }
        }
        return this.grid;
    }
    pickrandomNumberFromBag() {
        var keys = Object.keys(this.bag);
        return parseInt(keys[keys.length * Math.random() << 0]);
    }
    ;
    removeNumberFromBag(index) {
        delete this.bag[index];
    }
};
LotoService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], LotoService);
exports.default = LotoService;
//# sourceMappingURL=loto.service.js.map