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
      this.logentries = new LeNode({ token: config.token });
   }
};

LogentriesLogger.prototype.log = function(logLevel, args) {
   args.forEach(function(arg) {
      this.logentries.log(logLevelMapping[logLevel], arg);
   }.bind(this));
};
