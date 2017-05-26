"use strict";

let request = require("request");
let {JSDOM} = require("jsdom");
let urlUtil = require("./utils/url");

class Worker{
    work(url){
        return new Promise((resolve, reject)=>{
            request(url, function (error, response, body) {
                if(error){
                    resolve({
                        status: false,
                        data: {
                            url,
                            title: "Failed to scrape"
                        },
                        urls : []
                    });
                } else{
                    const dom = new JSDOM(body);
                    
                    //find title
                    let titleElement = dom.window.document.querySelector("title");
                    let title = titleElement ? titleElement.textContent : "No title";

                    //findLinks 
                    let anchorLinks = dom.window.document.querySelectorAll("a");
                    let urls = [];
                    Array.from(anchorLinks).forEach(node=>{
                        let anchorUrl = node.getAttribute("href");
                        if(urlUtil.isSameDomain(anchorUrl, url)){
                            urls.push(anchorUrl);
                        }
                    });
                    
                    //resolving with appropriate data
                    resolve({
                        data:{
                            url,
                            title
                        },
                        urls
                    });
                }
            });
        });
    }
}

module.exports = Worker;