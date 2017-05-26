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
        console.log("saving"+ url+ title);
        fs.appendFile(outputFilePath, dataToWrite, "utf8", (err) => {
            if (err) {
                console.log(`ERR!! Some error occured while saving ${dataToWrite}`);
            }
        });
    }

    //to flush the previous data
    flush(){
        let header = "Url,Title,";
        fs.writeFile(outputFilePath, header, "utf8", (err) => {
            if (err) {
                console.log("ERR!! Some error occured while saving header");
                console.log("Please restart again.");
                process.exit(-1);
            }
        });
    }
}

module.exports = new Keeper();