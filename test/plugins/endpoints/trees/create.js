/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var CP = require('child_process');
var Path = require('path');
// var Sinon = require('sinon');
var Server = require('../../../../lib/server');
// var Tree = require('../../../../lib/models/trees');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;

var server;

describe('POST /trees', function(){
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

  it('should return an error if length != 24', function(done){
    server.inject({method: 'POST', url: '/trees', credentials: {_id: 'g0000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

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
