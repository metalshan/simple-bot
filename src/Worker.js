"use strict";

let fetch = require("request-promise");
let {JSDOM} = require("jsdom");
let urlUtil = require("./utils/url");

class Worker{
    //this function does the scraping
    async work(url){
        console.log("i am working");
        let body = "";
        try{
            body = await fetch(url);
        } catch(error){
            return this.failureResponse(url);
        }
        const dom = new JSDOM(body);                
        //find title
        let title = this.findTitleFromDOM(dom);
        //findLinks 
        let urls = this.findRelativeUrlsFromDOM(dom, url);

        //resolving with appropriate data
        return {
            status: true,
            data:{
                url,
                title
            },
            urls
        };
    }

    //get the title from the dom element
    findTitleFromDOM(dom){
        let titleElement = dom.window.document.querySelector("title");
        let title = titleElement ? titleElement.textContent : "No title";
        return title;
    }

    //get the relative links from the page
    findRelativeUrlsFromDOM(dom, url){
        let anchorLinks = dom.window.document.querySelectorAll("a");
        let urls = [];
        Array.from(anchorLinks).forEach(node=>{
            let anchorUrl = node.getAttribute("href");
            if(urlUtil.isSameDomain(anchorUrl, url)){
                urls.push(anchorUrl);
            }
        });
        return urls;
    }

    //failure response
    failureResponse(url){
        return {
            status: false,
            data: {
                url,
                title: "Failed to scrape"
            },
            urls : []
        };
    }
}

module.exports = Worker;