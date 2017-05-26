"use strict";

let fs = require("fs");
const config = require("../config.json");
const outputFilePath = config.outputCSV;

class Keeper {
    constructor(){
        this.flush();
    }

    //this will append the new data to the file
    save({url, title}){
        let dataToWrite = `\n${url},${title},`;
        this.writeStream.write(dataToWrite);
        console.log(`\nSaving ${url}`);
        console.log(`Title = ${title}`);
    }

    //to flush the previous data
    flush(){
        let header = "Url,Title,";
        var wstream = fs.createWriteStream(outputFilePath);
        wstream.write(header);
        this.writeStream = wstream;
    }
}

module.exports = new Keeper();