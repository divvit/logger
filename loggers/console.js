'use strict';

var moment = require('moment');
var colors = require('colors');

var logLabels = {
   'trace': 'TRACE',
   'debug': 'DEBUG',
   'info': 'INFO',
   'warn': 'WARN',
   'error': 'ERROR',
   'fatal': 'FATAL',
}

var logColors = {
   'trace': colors.yellow,
   'debug': colors.green,
   'info': colors.blue,
   'warn': colors.magenta,
   'error': colors.red,
   'fatal': colors.red,
}

var ConsoleLogger = module.exports = function(config) {
   this.config = config;
};


ConsoleLogger.prototype.log = function(logLevel, args) {
   args.forEach(function(arg) {
      console.log(
         moment().utc().format('YYYY-MM-DD HH:mm:ss'),
         logColors[logLevel]( '[' + logLabels[logLevel] + ']'),
         arg
      );
   });
};

