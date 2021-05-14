import { Service } from 'typedi';

@Service()
export default class LotoService {
    totalCasesGrid: number = 90
    totalNumbersGrid: number = 15
    totalNumbersRow: number = 5
    totalNumbersCol: number = 2

    /** sac de numéros à tirer */
    bag: any = {};

    /** grille résultat */
    grid: any = {}

    // lignes complètes : 5 numéros
    full_rows: number[] = [];

    // colonnes pleines : 2 numéros
    full_cols: number[] = [];

    constructor() { }

    newCard() {
        this.grid = { 1: {}, 2: {}, 3: {} }

        this.bag = {}

        for (let index = 1; index <= this.totalCasesGrid; index++) {
            this.bag[index] = 0
        }

        this.full_rows.splice(0, this.full_rows.length)

        this.full_cols.splice(0, this.full_cols.length)

        return this.generateCardNumbers()
    }

    generateCardNumbers() {
        let numberPlaced: number = 0;
        let col: number = 0
        let row: number = 0

        while (numberPlaced < this.totalNumbersGrid) {

            // on tire un numéro et on le retire du sac
            const numberPicked: number = this.pickrandomNumberFromBag()

            this.removeNumberFromBag(numberPicked)

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

            const diffArray: any[] = [1, 2, 3].concat(this.full_rows).filter(function (e, i, array) {
                // Check if the element is appearing only once
                return array.indexOf(e) === array.lastIndexOf(e);
            });

            let rows: number[] = []

            diffArray.forEach(val => {
                if (!this.grid[val][col]) {
                    rows.push(val)
                }
            })

            if (!rows.length) {
                continue;
            }

            row = rows[0];

            this.grid[row][col] = numberPicked;

            numberPlaced++

            if (Object.keys(this.grid[row]).length === this.totalNumbersRow) {
                this.full_rows.push(row);
            }

            const numbersPickedCol: number = (this.grid[1][col] ? 1 : 0) + (this.grid[2][col] ? 1 : 0) + (this.grid[3][col] ? 1 : 0);

            if (numbersPickedCol === this.totalNumbersCol) {
                this.full_cols.push(col)
            }
        }

        return this.grid
    }

    private pickrandomNumberFromBag(): number {
        var keys = Object.keys(this.bag);

        return parseInt(keys[keys.length * Math.random() << 0]);
    };

    private removeNumberFromBag(index: number) {
        delete this.bag[index]
    }

}
