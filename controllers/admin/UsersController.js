Admin.UsersController = Class(Admin, 'UsersController').inherits(RestfulController)({
  prototype : {
    index : function index(req, res, next) {
      ACL.isAllowed('index', 'admin.users', req.role, {}, function(err, isAllowed) {
        if (err) {
          return next(err);
        }

        if (!isAllowed) {
          return next(new ForbiddenError());
        }

        User.all(function(err, result) {
          if (err) {
            return next(err);
          }

          res.locals.users = result;

          res.render('admin/users/index.html', { layout : 'admin' });
        });
      });
    },

    show : function show(req, res, next) {
      ACL.isAllowed('show', 'admin.users', req.role, {}, function(err, isAllowed) {
        if (err) {
          return next(err);
        }

        if (!isAllowed) {
          return next(new ForbiddenError());
        }

        User.find({ id : hashids.decode(req.paramas.userId)[0] }, function(err, result) {
          if (err) {
            return next(err);
          }

          if (result.length === 0) {
            return next(new NotFoundError());
          }

          res.locals.user = result[0];
          res.render('admin/users/index.html', { layout : 'admin' });
        });
      });

    },

    new : function(req, res, next) {
      ACL.isAllowed('new', 'admin.users', req.role, {}, function(err, isAllowed) {
        if (err) {
          return next(err);
        }

        if (!isAllowed) {
          return next(new ForbiddenError());
        }

        res.render('admin/users/new.html');
      });
    },

    create : function create(req, res, next) {
      ACL.isAllowed('create', 'admin.users', req.role, {}, function(err, isAllowed) {
        if (err) {
          return next(err);
        }

        if (!isAllowed) {
          return next(new ForbiddenError());
        }

        var person,
            user,
            anonymous;

        async.series([function(done) {
          person = new Entity({
            type : 'person',
            name : req.body.name,
            lastname : req.body.lastname,
            profileName : req.body.profileName,
            isAnonymous : false
          });

          person.save(done);
        }, function(done) {
          user = new User({
            entityId : person.id,
            username : req.body.username,
            email : req.body.email,
            password : req.body.password
          });

          user.save(function(err, result) {
            if (err) {
              person.destroy(function() {
                return done(err);
              });
            }

            done();
          })
        }, function(done) {
          anonymous = new Entity({
            type : 'person',
            name : 'Anonymous',
            lastname : 'anonymous',
            profileName : 'anonymous_' + hashids.encode(person.id),
            isAnonymous : true
          });

          anonymous.save(function(err, result) {
            if (err) {
              person.destroy(function(){});
              user.destroy(function(){});
              return done(err);
            }

            done();
          });
        }, function(done) {
          var ownership = new EntityOwner({
            ownerId : person.id,
            ownedId : anonymousId
          });

          ownership.save(function(err, result) {
            if (err) {
              person.destroy(function(){});
              user.destroy(function(){});
              anonymous.destroy(function(){});

              return done(err);
            }

            done();
          });
        }], function(err) {
          if (err) {
            req.flash('error', 'There was an error creating the user.');

            if (err.errors) {

              var errors = [];

              Object.keys(err.errors).forEach(function(k) {
                err.errors[k].errors.forEach(function(error) {
                  var obj = {}
                  obj[k] = error.message
                  errors.push(obj);
                })
              })
            } else {
              var errors = err;
            }

            return res.render('admin/users/new.html', { layout : 'admin', errors : errors });
          }

          UserMailer.new(user, person, function(err, result) {
            if (err) {
              req.flash('error', 'There was an error sending the activation email.');
              return res.redirect('/admin/admin');
            }

            req.flash('success', 'User created and Activation Mail sent.');
            res.redirect('/admin/users');
          });
        });
      });
    },

    edit : function edit(req, res, next) {
      ACL.isAllowed('edit', 'admin.users', req.role, {}, function(err, isAllowed) {
        if (err) {
          return next(err);
        }

        if (!isAllowed) {
          return next(new ForbiddenError());
        }

        User.find({ id : hashids.decode(req.params.userId)[0] }, function(err, result) {
          if (err) {
            return next(err);
          }

          if (result.length === 0) {
            return next(new NotFoundError());
          }

          res.locals.user = result[0];
          res.render('admin/users/edit.html');
        });
      });
    },

    update : function update(req, res) {
      ACL.isAllowed('update', 'admin.users', req.role, {}, function(err, isAllowed) {
        if (err) {
          return next(err);
        }

        if (!isAllowed) {
          return next(new ForbiddenError());
        }

        User.find({ id : hashids.decode(req.params.userId)[0] }, function(err, result) {
          if (err) {
            return next(err);
          }

          if (result.length === 0) {
            return next(new NotFoundError());
          }

          var user = new User(result[0]);

          user.username = req.body.username;
          user.email = req.body.email;
          user.password = req.body.password;

          user.save(function(err, result) {
            if (err) {
              return next(err);
            }

            req.flash('success', 'User updated');
            res.redirect('/admin/users/' + req.params.userId);
          });
        });
      });
    },

    destroy : function destroy(req, res, next) {
      ACL.isAllowed('destroy', 'admin.users', req.role, {}, function(err, isAllowed) {
        if (err) {
          return next(err);
        }

        if (!isAllowed) {
          return next(new ForbiddenError());
        }

        User.find({ id : hashids.decode(req.params.userId)[0] }, function(err, result) {
          if (err) {
            return next(err);
          }

          if (result.length === 0) {
            return next(new NotFoundError());
          }

          var user = new User(result[0]);

          user.markAsDeleted(function(err, result) {
            if (err) {
              return next(err);
            }

            req.flash('success', 'User marked as deleted.');
            res.redirect('/admin/users');
          })
        })

      });
    }
  }
});

module.exports = new Admin.UsersController();
