var moment = require('moment')
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('Entities', function(t) {
      t.dropColumn('last_notification_date');
    }).then(function() {
      return knex.schema.table('Entities', function(t) {
        t.timestamp('last_notification_date').defaultTo(moment().subtract(1, 'month').format());
      });
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('Entities', function (t) {
      t.timestamp('last_notification_date').defaultTo(null);
    })
  ]);
};
