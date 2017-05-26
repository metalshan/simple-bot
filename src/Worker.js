"use strict";

class Worker{
    work(){
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve(["url1", "url2"]);
            },2000);
        });
    }
}

module.exports = Worker;