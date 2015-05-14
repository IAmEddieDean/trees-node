'use strict';

var Tree = require('../../../models/trees');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/trees',
    config: {
      description: 'show all trees',
      handler: function(request, reply){
        Tree.find({ownerId: request.auth.credentials._id}, function(err, trees){
          return reply({trees: trees}).code(err ? 400 : 200);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'trees.index'
};
