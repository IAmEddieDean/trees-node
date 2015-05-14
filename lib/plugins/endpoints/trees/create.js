'use strict';

var Tree = require('../../../models/trees');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/trees',
    config: {
      description: 'Create a tree',
      handler: function(request, reply){
        var tree = new Tree();
        tree.ownerId = request.auth.credentials._id;
        console.log(tree);
        tree.save(function(err, oneTree){
          return reply(oneTree).code(err ? 400 : 200);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'trees.create'
};
