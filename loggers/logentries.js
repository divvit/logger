'use strict';

var LeNode = require('le_node');

var logLevelMapping = {
   'trace': 'debug',
   'debug': 'debug',
   'info': 'info',
   'warn': 'warning',
   'error': 'err',
   'fatal': 'emerg',
}

var LogentriesLogger = module.exports = function(config) {
   if (!config.token) {
      console.log('Divvit logger: no logentries token supplied, will not log to logentries.');
      this.logentries = undefined;
   } else {
      this.logentries = new LeNode({ token: config.token, withLevel: true, timestamp: false });
   }
};

LogentriesLogger.prototype.log = function(logLevel, args) {
   args.forEach(function(arg) {
      // call asynchronously, otherwise we can encounter buffer overflow errors
      setImmediate(function() {
         // don't sent arg directly, but send as object. le_node automatically inserts level property which will
         // then modify the original object which we don't want
         this.logentries.log(logLevelMapping[logLevel], { msg: arg });
      }.bind(this));
   }.bind(this));
};

LogentriesLogger.prototype.cleanup = function(callback) {
   // this is the recommended way which doesn't work...
   //this.logentries.once('connection drain', () => callback());

   // so let's just give the app a few seconds to send the final log events
   setTimeout(callback, 2000);
};
