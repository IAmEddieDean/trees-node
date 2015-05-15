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

describe('DELETE /trees', function(){
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

  it('should delete a tree', function(done){
    server.inject({method: 'DELETE', url: '/trees/b00000000000000000000001/kill', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result._id.toString()).to.have.length(24);
      done();
    });
  });
  it('should return 400', function(done){
    server.inject({method: 'DELETE', url: '/trees/b00000000000000000000001/kill', credentials: {_id: 'b0000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  it('should throw db error', function(done){
    var stub = Sinon.stub(Tree, 'findOneAndRemove').yields(new Error());
    server.inject({method: 'DELETE', url: '/trees/b00000000000000000000001/kill', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
