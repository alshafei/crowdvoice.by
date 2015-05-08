var Voice = Class('Voice').inherits(Argon.KnexModel)({

  validations : {},

  storage : (new Argon.Storage.Knex({
    tableName : 'Voices',
    queries : {
      findPosts : function(requestObj, callback) {
        switch (requestObj.clauseType) {
          case 'where':
            db(requestObj.model.storage.tableName).where(requestObj.params).andWhere('voice_id', requestObj.voiceId).exec(callback);
            break;
          case 'whereRaw':
            db(requestObj.model.storage.tableName).whereRaw(requestObj.params[0], requestObj.params[1]).andWhere('voice_id', requestObj.voiceId).exec(callback);
            break;
          default:
            db(requestObj.model.storage.tableName).where('voice_id', requestObj.voiceId).exec(callback)
        }
      }
    }
  })),

  findByOwnerId : function findByOwnerId(ownerId, callback) {
    var Model, request;

    Model = this;

    request = {
      action : 'findByOwnerId',
      model : Model,
      params : {
        'owner_id' : ownerId
      }
    };

    this.dispatch('beforeFindByOwnerId');

    this.storage.findByOwnerId(request, function(err, data) {
      callback(err, data);
      Model.dispatch('afterFindById');
    });
  },

  prototype : {
    updatePostCount : function updatePostCount(param, callback) {
      if (param) {
        this.postCount++;
      } else {
        this.postCount--;
      }

      this.save(callback);
    },

    // Has Many Posts Association
    posts : function posts(whereClause, callback) {
      var model = this;

      if (!model.id) {
        return [];
      }

      var request = {
        action : 'findPosts',
        voiceId : model.id
      }

      switch (whereClause.constructor) {
        case Object:
          request.clauseType = 'where';
          break;
        case Array:
          if (whereClause.length === 2) {
            request.clauseType = 'whereRaw';
          }
          break;
      }

      request.params = whereClause;

      this.constructor.dispatch('beforeFindPosts');

      this.constructor.storage.findPosts(request, function(err, data) {
        callback(err, data);
        model.constructor.dispatch('afterFindPosts');
      });
    }
  }
});

module.exports = Voice;
