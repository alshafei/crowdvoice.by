#!/usr/bin/env node
'use strict';

require('neonode-core');
require('tellurium');

require(process.cwd() + '/node_modules/tellurium/reporters/pretty');

Tellurium.reporter = new Tellurium.Reporter.Pretty({
  colorsEnabled : true
});

var async = require('async');
var crypto = require('crypto');

function uid (number) {
  return crypto.randomBytes(number).toString('hex');
}

CONFIG.database.logQueries = false;

function setup (done) {
  Promise.all([
    db('Entities').del(),
    db('EntityFollower').del(),
    db('EntityOwner').del(),
    db('Voices').del(),
  ]).then(function () {
    done();
  });
}

/* Entity Model Tests
 *
 */
Tellurium.suite('Entity Model')(function () {

  this.beforeEach(function (spec) {
    spec.registry.entityData = {
      type: 'person',
      name: 'John' + uid(16),
      profileName: 'john' + uid(16),
      lastname: 'Doe',
      isAnonymous: false
    };
    spec.registry.organizationData = {
      type: 'organization',
      name: 'Org1' + uid(16),
      profileName: 'org1' + uid(16),
      isAnonymous: false
    };
    spec.registry.voiceData = {
      title: 'title',
      status: 'active',
      type: 'text'
    };
  });

  this.describe('Validations')(function () {
    this.specify('type should validate that type is present')(function (spec) {
      var data = spec.registry.entityData, entity;

      data.type = '';
      entity = new Entity(data);

      entity.isValid(function (valid) {
        spec.assert(valid).toBe(false);
        spec.completed();
      });
    });

    this.specify('should validate that type is present')(function (spec) {
      var data = spec.registry.entityData, entity;

      data.type = '';
      entity = new Entity(data);

      entity.isValid(function (valid) {
        spec.assert(valid).toBe(false);
        spec.completed();
      });
    });

    this.specify('type cannot be different than person|organization')(function (spec) {
      var data = spec.registry.entityData, entity;

      data.type = 'hola';
      entity = new Entity(data);

      entity.isValid(function (valid) {
        spec.assert(valid).toBe(false);
        spec.completed();
      });
    });

    this.specify('should pass if type is person')(function (spec) {
      var data = spec.registry.entityData, entity;

      data.type = 'person';
      entity = new Entity(data);
      entity.isValid(function (valid) {
        spec.assert(valid).toBe(true);
        spec.completed();
      });
    });

    this.specify('type should pass if type is organization')(function (spec) {
      var data = spec.registry.entityData, entity;

      data.type = 'organization';
      entity = new Entity(data);

      entity.isValid(function (valid) {
        spec.assert(valid).toBe(true);
        spec.completed();
      });
    });

    this.specify('name should be present')(function (spec) {
      var data = spec.registry.entityData, entity;

      data.name = '';
      entity = new Entity(data);
      entity.isValid(function (err) {
        spec.assert(err !== null).toBe(true);
        spec.completed();
      });
    });

    this.specify('name should have a length <= 512')(function (spec) {
      var data = spec.registry.entityData, entity;

      data.name = '';
      for (var i = 0; i < 513; i+=1) {
        data.name += 'a';
      }
      entity = new Entity(data);
      entity.isValid(function (valid) {
        spec.assert(valid === false).toBe(true);
        spec.completed();
      });
    });

    this.specify('lastname should have a length <= 512')(function (spec) {
      var data = spec.registry.entityData, entity;

      data.lastname = '';
      for (var i = 0; i < 513; i+=1) {
        data.lastname += 'a';
      }
      entity = new Entity(data);
      entity.isValid(function (valid) {
        spec.assert(valid).toBe(false);
        spec.completed();
      });
    });

    this.specify('should not save if its not boolean')(function (spec) {
      var data = spec.registry.entityData, entity;

      data.isAnonymous = 234;
      entity = new Entity(data);
      entity.isValid(function (valid) {
        spec.assert(valid === false).toBe(true);
        spec.completed();
      });
    });

    this.specify('should save if it is boolean')(function (spec) {
      var data = spec.registry.entityData, entity;

      data.isAnonymous = true;
      entity = new Entity(data);
      entity.isValid(function (valid) {
        spec.assert(valid === true).toBe(true);
        spec.completed();
      });
    });

  });

  this.describe('EntityFollower')(function (spec) {

    this.specify('followEntity should create a EntityFollower relation')(function (spec) {
      var e1, e2;

      async.series([
        function (done) {
          e1 = new Entity(spec.registry.entityData);
          e1.save(done);
        },
        function (done) {
          e2 = new Entity(spec.registry.organizationData);
          e2.save(done);
        },
        function (done) {
          e1.followEntity(e2, done);
        },
        function (done) {
          db('EntityFollower').where('follower_id', '=', e1.id).andWhere('followed_id', '=', e2.id).then(function (result) {
            spec.assert(result[0].follower_id).toBe(e1.id);
            spec.assert(result[0].followed_id).toBe(e2.id);
            spec.completed();
          });
        }
      ], function () {
        spec.completed();
      });
    });

  });

  this.describe('VoiceFollowers')(function (done) {

    this.specify('followVoice should create a VoiceFollowers relation')(function (spec) {
      var e1, v1;

      async.series([
        function (done) {
          e1 = new Entity(spec.registry.entityData);
          e1.save(done);
        },
        function (done) {
          v1 = new Voice(spec.registry.voiceData);
          v1.ownerId = e1.id;
          v1.save(done);
        },
        function (done) {
          e1.followVoice(v1, done);
        },
        function (done) {
          db('VoiceFollowers').where('entity_id', '=', e1.id).andWhere('voice_id', '=', v1.id).then(function (result) {
            spec.assert(result[0].entity_id).toBe(e1.id);
            spec.assert(result[0].voice_id).toBe(v1.id);
            done();
          });
        }
      ], function (err) {
        if (err) { console.log(err) };
        spec.assert(err ? true : false).toBe(false);
        spec.completed();
      });
    });
  });

  this.describe('inviteEntity')(function (done) {
    var entityData = {
      type: 'person',
      name: 'John',
      lastname: 'Doe',
      isAnonymous: false
    };

    this.specify('inviteEntity should create an InvitationRequest relation')(function (spec) {
      var e1, e2;

      async.series([
        function (done) {
          e1 = new Entity(spec.registry.entityData);
          e1.save(done);
        },
        function (done) {
          e2 = new Entity(spec.registry.organizationData);
          e2.save(done);
        },
        function (done) {
          e2.inviteEntity(e1, done);
        },
        function (done) {
          db('InvitationRequest').where('invited_entity_id', '=', e1.id).andWhere('invitator_entity_id', '=', e2.id).then(function (result) {
            spec.assert(result[0].invited_entity_id === e1.id).toBe(true);
            spec.assert(result[0].invitator_entity_id === e2.id).toBe(true);
            done();
          });
        }
      ], function (err) {
        spec.assert(err ? true : false).toBe(false);
        spec.completed();
      });
    });
  });

  this.describe('ownOrganization')(function () {

    this.specify('ownOrganization should create an EntityOwner relation')(function (spec) {
      var e1, e2;

      async.series([
        function (done) {
          e1 = new Entity(spec.registry.entityData);
          e1.save(done);
        },
        function (done) {
          e2 = new Entity(spec.registry.organizationData);
          e2.save(done);
        },
        function (done) {
          e1.ownOrganization(e2, done);
        },
        function (done) {
          db('EntityOwner').where('owner_id', '=', e1.id).andWhere('owned_id', '=', e2.id).then(function (result) {
            spec.assert(result[0].owner_id === e1.id).toBe(true);
            spec.assert(result[0].owned_id === e2.id).toBe(true);
            done();
          });
        }
      ], function (err) {
        spec.assert(err ? true : false).toBe(false);
        spec.completed();
      });
    });
  });

  this.describe('Owned Voices')(function () {
    var e1, v1;

    this.specify('Should return owned voices')(function (spec) {
      async.series([
        function (done) {
          e1 = new Entity(spec.registry.entityData);
          e1.save(done);
        },
        function (done) {
          v1 = new Voice(spec.registry.voiceData);
          v1.title = 'MyVoice';
          v1.ownerId = e1.id;
          v1.save(done);
        }
      ], function (err) {
        if (err) { console.log(err); }

        e1.voices(function (err, voices) {
          spec.assert(voices[0].ownerId).toBe(e1.id);
          spec.assert(voices[0].title).toBe('MyVoice');
          spec.completed();
        });
      });
    });
  });

});

setup(function () {
  Tellurium.run();
});
