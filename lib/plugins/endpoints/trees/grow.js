'use strict';

var Tree = require('../../../models/trees');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'PUT',
    path: '/trees/{treeId}/grow',
    config: {
      validate: {
        params: {
          treeId: Joi.string().hex().length(24).required()
        }
      },
      description: 'Grow a tree',
      handler: function(request, reply){
        Tree.findOne({ownerId: request.auth.credentials._id, _id: request.params.treeId}, function(err, tree){
          if(!err){
            var max = 1000;
            var height = tree.height;
            var odds = height / max;
            var roll = Math.random();
            if(roll < odds){
              tree.health -= Math.floor(Math.random() * 11);
            }else{
              tree.height += Math.floor(Math.random() * tree.height);
            }
            tree.save(function(){
              console.log('GODDAMNIT TREE!!!', tree);
              return reply(tree);
            });
          }else{
            return reply().code(400);
          }
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'trees.grow'
};
// tree.height = Math.floor(Math.random() * (tree.height / 10) + 1);
// tree.health = tree.health - Math.floor(Math.random() * (3 * (tree.height / 100)) + 1);