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

