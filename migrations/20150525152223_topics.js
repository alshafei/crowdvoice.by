'use strict';

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('Topics', function(t) {
      t.increments('id').primary();
      t.string('name', 512).unique();
      t.string('image', 512);
      t.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('Topics')
  ]);
};
