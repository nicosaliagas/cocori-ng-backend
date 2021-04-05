import SparkMD5 from 'spark-md5';
import { Service } from 'typedi';

const btoa = require('btoa');

@Service()
export default class UploaderService {

    constructor() { }

    checksum(buffer: ArrayBuffer): string {
        const spark = new SparkMD5.ArrayBuffer();

        spark.append(buffer);

        return btoa(spark.end(true));
    }

    pad(index: number, digit: number = 5): string {
        let str: string = index.toString()

        while (str.length < digit) str = "0" + str;

        return str
    }
}
