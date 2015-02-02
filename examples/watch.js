/*
 * Watch and reserve winston logs put to a Beanstalkd server.
 * First start watch.js and then put.js to see log messages.
 *
 * (C) 2015 Jason McInerney
 * MIT LICENCE
 *
 */
var bs = require('nodestalker'),
  tube = 'winston.log',
  //tube = 'winston.log.error'  // for filtering by level
  host = '0.0.0.0',
  port = 11300;

function processLog(log, cb) {
  console.log('processing log entry...');
  setTimeout(function() { cb(); }, 1000);
  return true;
}

function watchLog(host, port, tube) {
  var client = bs.Client(host + ':' + port);
  client.watch(tube).onSuccess(function(data) {
    console.log("Watching for logs on " + tube + "...");
    client.reserve().onSuccess(function(log) {
      console.log('received log:', log);
      // keep watching
      watchLog(host, port, tube);
      var success = processLog(log, function() {
        console.log("process callback");
      });
      console.log('processed: ' + success, log);
      if (success) {
        client.deleteJob(log.id).onSuccess(function(del_msg) {
          console.log('deleted', log);
          console.log(del_msg);
          client.disconnect();
        });
      } else {
        console.log('job failed, burying', job);
        client.bury(job.id);
      }
    });
  });
}

watchLog(host, port, tube);