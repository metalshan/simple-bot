"use strict";

let args = require("yargs").argv;
let distributor = require("./src/distributor");
let urlUtils = require("./src/utils/url");

const config = require("./config.json");
const defaultFirstPage = config.defaultKickoffUrl;
let firstPageToCrawl = args.page || defaultFirstPage;

//check if valid url
if(!urlUtils.validateUrl(firstPageToCrawl)){
    console.log("ERR!! Invalid url provided.");
} else {
    distributor.initiate(firstPageToCrawl); //it will kickoff the task
}
