"use strict";

class Worker{
    work(url){
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve({
                    data:{
                        url: url,
                        title: "I am a title"
                    },
                    urls: ["url1", "url2"]
                });
            },2000);
        });
    }
}

module.exports = Worker;