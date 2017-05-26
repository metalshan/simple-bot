"use strict";

let fs = require("fs");
const outputFilePath = "./output.csv";

class Keeper {
    constructor(){
        this.flush();
    }

    //this will append the new data to the file
    save({url, title}){
        let dataToWrite = `\n${url},${title},`;
        this.writeStream.write(dataToWrite);
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