"use strict";

let args = require("yargs").argv;
let distributor = require("./src/distributor");
let urlUtils = require("./src/utils/url");
const defaultFirstPage = "https://medium.com/";

let firstPageToCrawl = args.page || defaultFirstPage;

//check if valid url
if(!urlUtils.validateUrl(firstPageToCrawl)){
    console.log("ERR!! Invalid url provided.");
} else {
    distributor.initiate(firstPageToCrawl);
}
