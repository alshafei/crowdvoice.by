var BlackListFilter = require(__dirname + '/BlackListFilter');

var EntitiesController = Class('EntitiesController').includes(BlackListFilter)({

  prototype : {
    init : function () {
      this._initRouter();
      return this;
    },

    _initRouter : function () {
      var controller = EntitiesController;

      application.router.route('/:profile_name*')
        .all(this.filterAction(controller, 'getEntityByProfileName'));

      application.router.route('/:profile_name')
        .get(this.filterAction(controller, 'show'));
      application.router.route('/:profile_name')
        .put(this.filterAction(controller, 'update'));
      application.router.route('/:profile_name/edit')
        .get(this.filterAction(controller, 'edit'));

      application.router.route('/:profile_name/follow')
        .get(this.filterAction(controller, 'follow'));
      application.router.route('/:profile_name/voices')
        .get(this.filterAction(controller, 'voices'));
      application.router.route('/:profile_name/recommended')
        .get(this.filterAction(controller, 'recommended'));
    },

    getEntityByProfileName : function (req, res, next) {
      Entity.find({
        profile_name: req.params.profile_name
      }, function (err, result) {
        if (err) { next(err); return; }
        if (result.length === 0) { next(new NotFoundError('Entity Not Found')); return; }

        req.entity = new Entity(result[0]);
        req.entityType = req.entity.type;
        res.locals[req.entityType] = req.entity;
        next();
      });
    },

    getEntity : function getEntity (req, res, next) {
      Entity.find({
        id: req.params.id,
        type: req.entityType
      }, function (err, result) {
        if (err) { next(err); return; }
        if (result.length === 0) {
          next(new NotFoundError('Entity Not Found')); return;
        }

        res.locals[req.entityType] = new Entity(result[0]);
        req.entity = new Entity(result[0]);

        next();
      });
    },

    index : function index (req, res, next) {
      Entity.find({type:req.entityType}, function (err, result) {
        if (err) { next(err); return; }

        if (result.length === 0) {
          next(new NotFoundError('Entity Not Found')); return;
        }

        res.format({
          'text/html': function () {
            res.locals[inflection.pluralize(req.entityType)] = result;
            res.render(req.entityType + '/index.html', {});
          },
          'application/json': function () {
            res.json(result);
          }
        });
      });
    },

    show : function show (req, res, next) {
      res.render(inflection.pluralize(req.entityType) + '/show.html');
    },

    new : function (req, res, next) {
      res.render(inflection.pluralize(req.entityType) + '/new.html', {errors: null});
    },

    create : function create (req, res, next) {
      var entity = new Entity({
        name: req.body['name'],
        lastname: req.body['lastname'],
        profileName: req.body['profileName'],
        isAnonymous: req.body['isAnonymous'] === "true" ? true : false
      });
      entity.type = req.entityType;
      entity.save(function (err) {
        if (err) {
          res.render(req.entityType + '/new.html', {errors: err});
        } else {
          res.redirect('/' + entity.profileName);
        }
      });
    },

    edit : function edit (req, res, next) {
      res.render(inflection.pluralize(req.entityType) + '/edit.html', {errors: null});
    },

    update : function update (req, res, next) {
      var entity = req.entity;
      entity.setProperties({
        name: req.body['name'] || entity.name,
        lastname: req.body['lastname'] || entity.lastname,
        profileName: req.body['profileName'] || entity.profileName,
      });
      if (typeof(req.body['isAnonymous']) !== 'undefined') {
        entity.isAnonymous = (req.body['isAnonymous'] === "true") ? true : false
      }
      entity.save(function (err) {
        if (err) {
          res.render(req.entityType + '/edit.html', {errors: err});
        } else {
          res.redirect('/' + req.entityType + '/' + entity.id + '/edit');
        }
      });
    },

    follow : function follow (req, res, next) {
      var entity = req.entity, follower;

      Entity.find({ id: req.body.followAs }, function (err, result) {
        if (err) { next(err); return; }

        if (result.length === 0) {
          next(new NotFoundError('Entity Not Found')); return;
        }

        follower = new Entity(result[0]);

        // TODO: Check if follower is authorized to do this.
        follower.followEntity(entity, function (err) {
          if (err) { next(err); }
          res.redirect('/' + entity.profileName);
        });
      });
    },

    voices : function voices (req, res, next) {
      var entity = req.entity;
      Voice.find({owner_id: entity.id}, function (err, result) {
        if (err) { next(err); return; }

        // Filter hidden info.
        result.forEach(function (voice) {
          delete(voice.ownerId);
        });

        res.format({
          'application/json': function () {
            res.send(result);
          },
          'text/html': function () {
            next(new Error('Not found'));
          }
        });
      });
    },

    recommended : function recommended (req, res, next) {
      var entity = req.entity;
      entity.recommendedVoices(function (err, voices) {
        if (err) { next(err); return; }
        res.format({
          'application/json': function () {
            res.json(voices);
          },
          'default': function () {
            next(new NotFoundError('Unknown format for this request'));
          }
        });
      });
    }
  }
});

module.exports = new EntitiesController();
