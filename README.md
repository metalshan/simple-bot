# Sample bot
This is a bot to perform a recursively infinite crawling of a certain website. The number of concurrent calls can be restricted.

### How to configure
The configuration can be modified in `config.json` file which can be found in the root folder. The config file looks like the following.

	{
	    "outputCSV": "./output.csv",
	    "numberOfConcurrentRequests": 5,
	    "defaultKickoffUrl": "https://medium.com/"
	}

The property `outputCSV` contains the path of the file where the output will be saved. `numberOfConcurrentRequests` does exactly what the the name says; limiting the parallel requests. `defaultKickoffUrl` is the one who holds the url of the default start url in case you do not provide it from your node command line.


### How to start

> npm start

Npm start will trigger the operation considering `defaultKickoffUrl` as the first page to hit.

> node index.js --page="http://any-website.com/"

This will trigger the operation with starting page as the given one. 


### What to expect
The output will be a continuously saving `csv` file in `url, title` format. The status of the running application can also be seen in the console. It will continuously print the number of jobs in the queue, which worker is in what state etc.