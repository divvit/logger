var chai = require('chai'),
   expect = chai.expect,
   sinon = require('sinon'),
   sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe('logging', function() {

   beforeEach(function() {
      sinon.spy(console, 'log');
   });

   afterEach(function() {
      console.log.restore();
   });

   describe('logToConsole', function() {
      it('should log debug to console by default', function() {
         logger = require('./../index');

         logger.debug('some text');
         expect(console.log).to.be.called;
      });

      it('should log correct levels when configured', function() {
         logger = require('./../index');

         logger.configure({
            defaultLogLevel: 'info',
            loggers: {
               console: {
               }
            }
         });

         logger.debug('some text');
         expect(console.log).not.to.be.called;

         logger.info('some text');
         expect(console.log).to.be.called;

      });

      it('should load correct config when initialized several times', function() {
         logger1 = require('./../index');

         // this should influece logger2 as well
         logger1.configure({
            defaultLogLevel: 'info',
            loggers: {
               console: {
               }
            }
         });

         logger2 = require('./../index');

         logger1.debug('some text');
         expect(console.log).not.to.be.called;

         logger2.debug('some text');
         expect(console.log).not.to.be.called;

      });

      it('should automatically update its config after a timeout', function(done) {
         this.timeout(40000);

         logger1 = require('./../index');
         logger2 = require('./../INDEX');    // trick node into not cahing the module, so we can test properly

         logger1.configure({
            defaultLogLevel: 'warn',
            loggers: {
               console: {
               }
            }
         });

         logger1.info('some text');
         expect(console.log).not.to.be.called;
         console.log.reset();

         // immediately after should still use default config
         logger2.info('some text');
         expect(console.log).to.be.called;
         console.log.reset();

         // after timeout, should use new config
         setTimeout(function() {
            logger2.info('some text');
            expect(console.log).not.to.be.called;
            done();
         }, 32*1000);

      });
   });

});
