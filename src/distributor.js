"use strict";

const config = require("../config.json");
const maxConcurrent = config.numberOfConcurrentRequests;
//const tastQueueLimit = 100; //to avoid the chances of memory overflow
const IDLE = "idle";
const BUSY = "busy";

let Worker = require("./Worker");
let keeper = require("./keeper");

class Distributor{
    constructor(){
        this.refresh();
    }
    
    //to flush everything
    refresh(){
        this.workers = new Map();
        this.lastDistributedWorkerIndex = -1;
        this.taskQueue = [];
    }

    //This will initiate the process
    initiate(url){
        console.log(`Kicking off with base url ${url} \n`);
        
        //create workers
        for(let i=0; i<maxConcurrent; i++){
            let worker = new Worker();
            this.workers.set(worker, IDLE);
        }

        //start distributing
        this.pushToTaskQueue([url]);
        this.distribute();
    }

    pushToTaskQueue(urls){
        this.taskQueue.push(...urls);
    }

    distribute(){
        for (let [worker, status] of this.workers) {
            if(status===IDLE && this.taskQueue.length>0){
                let url = this.taskQueue.shift();
                let workerPromise = worker.work(url);
                workerPromise.then(this.handleWorkerResponse.bind(this, worker));
                this.workers.set(worker, BUSY);
            }
        }
        //status check
        this.statusCheck();
    }

    statusCheck(){
        console.log(`TaskQueue length is ${this.taskQueue.length} !!`);
        let index = 0;
        this.workers.forEach((status)=>{
            console.log(`Worker ${index} is ${status}`);
            index++;
        });
    }

    handleWorkerResponse(worker, {data, urls}){
        this.workers.set(worker, IDLE); //setting the worker as idle again

        // console.log(`Newly found urls from ${data.url} are...`);
        // urls.forEach(u=>console.log(u));

        this.pushToTaskQueue(urls);
        this.statusCheck();
        this.distribute();
        //saving crawled data
        keeper.save(data);
    }
}

module.exports = new Distributor();