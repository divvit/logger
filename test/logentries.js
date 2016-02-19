var chai = require('chai'),
   expect = chai.expect,
   sinon = require('sinon'),
   sinonChai = require('sinon-chai'),
   proxyquire =  require('proxyquire').noPreserveCache();

chai.use(sinonChai);

describe('logging', function() {

   beforeEach(function() {
      sinon.spy(console, 'log');
   });

   afterEach(function() {
      console.log.restore();
   });

   describe('logToLogentries', function() {
      it('should log to logentries', function() {
         var testLogString = 'hellolog';

         var leNodeStub = function() {
            return {
               log: function(logLevel, toLog) {
                  expect(toLog).to.equal(testLogString);
               }
            }
         }

         var LogEntriesLogger = proxyquire('./../loggers/logentries', { 'le_node': leNodeStub } );

         var logentriesLogger = new LogEntriesLogger({ token: 'abcd' });
         logentriesLogger.log('debug', [ testLogString ]);

      });

   });

});
