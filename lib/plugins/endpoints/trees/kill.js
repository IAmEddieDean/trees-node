'use strict';

var Tree = require('../../../models/trees');
// var Joi = require('joi')
exports.register = function(server, options, next){
  server.route({
    method: 'DELETE',
    path: '/trees/{treeId}/kill',
    config: {
      description: 'Create a tree',
      handler: function(request, reply){
        Tree.findOneAndRemove({_id: request.params.treeId, ownerId: request.auth.credentials._id}, function(err, tree){
          return reply(tree).code(err ? 400 : 200);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'trees.kill'
};
