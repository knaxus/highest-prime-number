# Let's move towards Scalablity

![cover](https://dev-to-uploads.s3.amazonaws.com/i/228847fx5bgi8lyp4zg4.jpg)

In this article, we'll get to know the preliminary steps you can take as a __Software Engineer__ for building a scalable system. 

*__Let's see how we can decrease loadtest time from 187s to 31s__*

__Note:__ I'll be using __Node.js__ but don't skip reading, try to absorb the concept, especially if you're a beginner. 

### Here is the task:

*__Build a server with only one `GET` request to return the highest Prime number between 0 - N__*

### My Setup

- I've used pure Node.js (Not `express.js`) for the creation of my server and routes as well, you are free to use `express.js`
- You can use this idea with any language, so don't skip reading but you can skip the code/code repo.

### Let's Start!

I used this as one of my assignments for hiring (experienced) devs. The session used to be a pair-programming setup where the __candidate was free to use the Internet__ and tools of his/her choice. Considering the kind of my routine work, such assignments are really helpful.

### When you wrote a brute-force approach

Let's assume you created your server with the basic algorithm to find a Prime Number. Here is an brute force approach example:

```javascript
// just trying the first thought in mind
function isPrime(n) {
  for(let i = 2; i <= Math.sqrt(n); i += 1) {
    if (n % i === 0){
      return false;
    }
  }
  return true;
}

function calculateGreatestPrimeInRange(num) {
    const primes = [];
    for (let i = 2; i <= num; i += 1) {
      if (this.isPrime(i)) primes.push(i);
    }
    return primes.length ? primes.pop() : -1;
  }
```
You'll try to use it in your `GET` route say like this `https:localhost:9090/prime?num=20`, it will work fine and you'll feel good. You tried it with some numbers like `?num=10, 55, 101, 1099` you will get instant response and life feels good :)

#### Hold On!

__As soon as you try a large number__ say `num=10101091` you will feel the lag (I've tried it in the browser, you can use __Postman__)

Since we are not using __PM2__ right now (which does a ton of things many of the beginners are not aware of), you'll notice that when you try to open a new tab and try for a smaller number, your tab will be waiting for the result of the previous tab.

### What you can do now?

Let's bring in concurrency!

- __Cluster mode at the rescue!__

Here is the block of code showing Cluster mode in action. If you are not aware of _Cluster Module_ please read about it. 

```javascript
const http = require('http');
const cluster = require('cluster');
const os = require('os');
const routes = require('./routes');

const cpuCount = os.cpus().length;

// check if the process is the master process
if (cluster.isMaster) {
  // print the number of CPUs
  console.log(`Total CPUs are: ${cpuCount}`);

  for (let i = 0; i < cpuCount; i += 1) cluster.fork();

  // when a new worker is started
  cluster.on('online', worker => console.log(`Worker started with Worker Id: ${worker.id} having Process Id: ${worker.process.pid}`));

  // when the worker exits
  cluster.on('exit', worker => {
    // log
    console.log(`Worker with Worker Id: ${worker.id} having Process Id: ${worker.process.pid} went offline`);
    // let's fork another worker
    cluster.fork();
  });
} else {
  // when the process is not a master process, run the app status
  const server = http.createServer(routes.handleRequests).listen(9090, () => console.log('App running at http://localhost:9090'));
}
```

### Voila! 

After implementing the Cluster Module, you'll see a drastic change!

You can notice after this using threads, the browser tab with a smaller number will get the response quickly meanwhile the other tab is busy doing the calculations (you can try it out in Postman as well)

For those who are not using Node.js, cluster mode means running your app in concurrent mode using the available threads in the CPU. 

Now we have a bit of relaxation but what else we can do to make it even more performant because our single requests with large numbers are still lagging?

### Algorithms at your rescue!

I know this is a haunting word but it is an essential tool you cannot ignore and in the end, after implementing a new algorithm you'll get to realize the worth of Algorithms.

So for prime numbers, we have a __[Sieve of Eratosthenes
](https://www.geeksforgeeks.org/sieve-of-eratosthenes/)__We have to tweak it a bit so as to fit this in our use-case. You can find the complete code in the repo inside the class `Prime`. 

Let's have a look at the __Loadtesting Results__

- Brute force approach for `num=20234456`

Command passed to the __loadtest module__:
```bash
loadtest -n 10 -c 10 --rps 200 "http://localhost:9090/prime?num=20234456"
```
Result:

```bash
INFO Total time:          187.492294273 s
INFO Requests per second: 0
INFO Mean latency:        97231.6 ms
INFO 
INFO Percentage of the requests served within a certain time
INFO   50%      108942 ms
INFO   90%      187258 ms
INFO   95%      187258 ms
INFO   99%      187258 ms
INFO  100%      187258 ms (longest request)
```


- Using SOE with modifications for `num=20234456`

Command passed to the __loadtest module__:
```bash
loadtest -n 10 -c 10 --rps 200 "http://localhost:9090/prime?num=20234456"
```

Result:

```bash
INFO Total time:          32.284605092999996 s
INFO Requests per second: 0
INFO Mean latency:        19377.3 ms
INFO 
INFO Percentage of the requests served within a certain time
INFO   50%      22603 ms
INFO   90%      32035 ms
INFO   95%      32035 ms
INFO   99%      32035 ms
INFO  100%      32035 ms (longest request)
```

You can compare both the results above and can see SOE is a clear winner here.

### Can we improve it further?

Yes, we can, we can add a __cache__, a plain Object in Javascript which can be used as a __HashMap__. 

Using a cache will store the result for a given number N, if we get a request again for N, we can simply return it from the store instead of doing the calculations.

__REDIS will do a much better job here__

#### Let's see the results

- Brute force approach with __cache__ for `num=20234456`

```bash
INFO Target URL:          http://localhost:9090/prime?num=20234456
INFO Max requests:        10
INFO Concurrency level:   10
INFO Agent:               none
INFO Requests per second: 200
INFO 
INFO Completed requests:  10
INFO Total errors:        0
INFO Total time:          47.291413455000004 s
INFO Requests per second: 0
INFO Mean latency:        28059.6 ms
INFO 
INFO Percentage of the requests served within a certain time
INFO   50%      46656 ms
INFO   90%      46943 ms
INFO   95%      46943 ms
INFO   99%      46943 ms
INFO  100%      46943 ms (longest request)

```

- Using SOE with modifications & __cache__ for `num=20234456`

```bash

INFO Target URL:          http://localhost:9090/prime-enhanced?num=20234456
INFO Max requests:        10
INFO Concurrency level:   10
INFO Agent:               none
INFO Requests per second: 200
INFO 
INFO Completed requests:  10
INFO Total errors:        0
INFO Total time:          31.047955697999996 s
INFO Requests per second: 0
INFO Mean latency:        19081.8 ms
INFO 
INFO Percentage of the requests served within a certain time
INFO   50%      23192 ms
INFO   90%      32657 ms
INFO   95%      32657 ms
INFO   99%      32657 ms
INFO  100%      32657 ms (longest request)

```

### Time Analysis
| Conditions | Time|
----- | --------------- |  
| With basic algo | 187.492294273 s
| With Cache |47.291413455000004 s
| With SOE | 32.284605092999996 s
| With SOE & Cache | 31.047955697999996 s

### Finally

I hope you understood the benefits of the following:
- Multithreading
- Algorithms
- Caching a.k.a Memoization

I hope you liked this short note, your suggestions are welcome.

You can find me on [Github](https://github.com/ashokdey), [LinkedIn](https://linkedin.com/in/ashokdey), and, [Twitter](https://twitter.com/ashokdey_)


<a rel="license" href="http://creativecommons.org/licenses/by/3.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/3.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/3.0/">Creative Commons Attribution 3.0 Unported License</a>.
