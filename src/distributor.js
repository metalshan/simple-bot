"use strict";

const maxConcurrent = 5;
let Worker = require("./Worker");

class Distributor{
    constructor(){
        this.refresh();
    }
    
    //to flush everything
    refresh(){
        this.workers = [];
        this.lastDistributedWorkerIndex = -1;
    }

    //This will initiate the process
    initiate(url){
        console.log(`Kicking off with base url ${url}`);
        
        //create workers
        this.workers = [];
        for(let i=0; i<maxConcurrent; i++){
            this.workers.push(new Worker());
        }

        //start distributing
        this.distribute([url]);
    }

    distribute(urls){
        urls.forEach(url=>{
            //simple round robin to get the accurate worker
            this.lastDistributedWorkerIndex++;
            if(this.lastDistributedWorkerIndex>=maxConcurrent){
                this.lastDistributedWorkerIndex = 0;
            }
            let workerToPerformThisTask = this.workers[this.lastDistributedWorkerIndex];

            let workerPromise = workerToPerformThisTask.work(url);
            workerPromise.then(this.handleNewUrls.bind(this));
        });
    }

    handleNewUrls(urls){
        console.log("Newly found urls are...");
        urls.forEach(u=>console.log(u));
    }
}

module.exports = new Distributor();