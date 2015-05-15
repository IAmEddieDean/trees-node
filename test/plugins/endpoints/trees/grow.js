/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var CP = require('child_process');
var Path = require('path');
var Sinon = require('sinon');
var Server = require('../../../../lib/server');
var Tree = require('../../../../lib/models/trees');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;

var server;

describe('PUT /trees/{treeId}/grow', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });
  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../../scripts')}, function(){
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });

  it('should return a tree with a random growth and potential health loss', function(done){
    server.inject({method: 'PUT', url: '/trees/b00000000000000000000001/grow', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.height).to.be.within(3, 5);
      expect(response.result.health).to.be.within(80, 100);
      done();
    });
  });
  it('should cause damage', function(done){
    var stub = Sinon.stub(Math, 'random');
    stub.onCall(0).returns(0).onCall(1).returns(0.5);
    server.inject({method: 'PUT', url: '/trees/b00000000000000000000001/grow', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.health).to.equal(92);
      stub.restore();
      done();
    });
  });

  it('should cause grow', function(done){
    var stub = Sinon.stub(Math, 'random');
    stub.onCall(0).returns(0.99).onCall(1).returns(0.7);
    server.inject({method: 'PUT', url: '/trees/b00000000000000000000001/grow', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.height).to.equal(4);
      stub.restore();
      done();
    });
  });
  it('should throw a db error', function(done){
    var stub = Sinon.stub(Tree, 'findOne').yields(new Error());
    server.inject({method: 'PUT', url: '/trees/b00000000000000000000001/grow', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });

  it('should force damage', function(done){
    server.inject({method: 'PUT', url: '/trees/b00000000000000000000003/grow', credentials: {_id: 'a00000000000000000000002'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.height).to.equal(1000);
      expect(response.result.health).to.be.within(80, 100);
      done();
    });
  });
});
