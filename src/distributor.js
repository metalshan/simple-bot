"use strict";

const config = require("../config.json");
const maxConcurrent = config.numberOfConcurrentRequests;
const IDLE = "idle";
const BUSY = "busy";

let Worker = require("./Worker");
let keeper = require("./keeper");

class Distributor{
    constructor(){
        this.refresh();
    }
    
    //to flush everything of the distributor component
    refresh(){
        this.workers = new Map();
        this.taskQueue = [];
    }

    //This will initiate the process
    initiate(url){
        console.log(`\nKicking off with base url ${url} \n`);
        
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
        this.statusCheck(); //status printing
        this.taskQueue.push(...urls);
        this.statusCheck(); //status printing      
    }

    distribute(){
        this.statusCheck(); //status printing
        
        for (let [worker, status] of this.workers) {
            if(status===IDLE && this.taskQueue.length>0){
                let url = this.taskQueue.shift();
                let workerPromise = worker.work(url);
                workerPromise.then(this.handleWorkerResponse.bind(this, worker));
                this.workers.set(worker, BUSY);
            }
        }

        this.statusCheck(); //status printing
    }

    //this prints the status of the queue and workers
    statusCheck(){
        console.log(`\nTaskQueue length is ${this.taskQueue.length} !!`);
        let index = 0; //taking index separately, cause Map.prototype.forEach doesn't provide index by itself
        this.workers.forEach((status)=>{
            console.log(`Worker ${index} is ${status}`);
            index++;
        });
    }

    handleWorkerResponse(worker, {data, urls}){
        this.workers.set(worker, IDLE); //setting the worker as idle again

        //push & distribute jobs
        this.pushToTaskQueue(urls);
        this.distribute();

        //saving crawled data
        keeper.save(data);
    }
}

module.exports = new Distributor();