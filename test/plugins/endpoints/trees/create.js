/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;

var server;

describe('POST /trees', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });

  // it('should return an error', function(done){
  //   server.inject({method: 'POST', url: '/trees', credentials: {_id: 'z00000000000000000000001'}}, function(response){
  //     var stub = Sinon.stub(Trees)
  //     expect(response.statusCode).to.equal(400);
  //     done();
  //   });
  // });

  it('should create a new tree with a height of 1', function(done){
    server.inject({method: 'POST', url: '/trees', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      console.log(response.result);
      expect(response.statusCode).to.equal(200);
      expect(response.result.height).to.equal(1);
      expect(response.result.health).to.equal(100);
      expect(response.result.ownerId.toString()).to.equal('a00000000000000000000001');
      done();
    });
  });
});
