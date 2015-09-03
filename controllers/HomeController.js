/* jshint multistr: true */

var VoicesPresenter = require(path.join(process.cwd(), '/presenters/VoicesPresenter'));
var TopicsPresenter = require(path.join(process.cwd(), '/presenters/TopicsPresenter'));
var EntitiesPresenter = require(path.join(process.cwd(), '/presenters/EntitiesPresenter'));

var isProfileNameAvailable = require(__dirname + '/../lib/util/isProfileNameAvailable.js');

var HomeController = Class('HomeController')({
  prototype : {
    index : function index(req, res, next) {
      // if the person is logged in, redirect to their feed
      if (req.currentPerson) {
        // commented cause SessionsController has something similar
        //req.flash('success', 'Logged in to your account successfully.');
        return res.redirect('/' + req.currentPerson.profileName + '/feed');
      }

      ACL.isAllowed('show', 'homepage', req.role, {}, function(err, isAllowed) {
        if (err) { return next(err); }

        if (!isAllowed) {
          return next(new ForbiddenError());
        }

        async.series([function(done) {
          // FeaturedVoices
          FeaturedVoice.all(function(err, result) {
            if (err) { return done(err); }

            var featuredIds = result.map(function(item) {
              return item.voiceId;
            });

            Voice.whereIn('id', featuredIds, function(err, voicesResult) {
              if (err) { return done(err); }

              var publishedVoices = voicesResult.filter(function (voice) {
                return voice.status === Voice.STATUS_PUBLISHED
              });

              VoicesPresenter.build(publishedVoices, req.currentPerson, function (err, voices) {
                if (err) { return done(err); }

                res.locals.featuredVoices = voices;

                done();
              });
            });
          });
        }, function(done) {
          Topic.all(function(err, result) {
            if (err) {
              return done(err);
            }

            TopicsPresenter.build(result, function(err, topics) {
              if (err) {
                return done(err);
              }

              res.locals.topics = topics;

              done();
            });
          });
        }, function(done) {
          Entity.find(['type = ? LIMIT ?', ['organization', 10]], function(err, result) {
            if (err) { return done(err); }

            EntitiesPresenter.build(result, req.currentPerson, function(err, organizations) {
              if (err) { return done(err); }

              res.locals.mostActiveOrganizations = organizations;

              done();
            });
          });
        }], function(err) {
          if (err) { return next(err); }

          res.render('home/index', {
            layout : 'application',
            pageName : 'page-home',
            notifications : require('./../public/demo-data/notifications'),

            /* =========================================================================== *
             *  HEADER STATS
             * =========================================================================== */
            globalStats : {
              countries: 36,
              organizations: 148,
              voices: 312,
              posts: 579371,
              people: 22665729
            }
          });
        });
      });

    },

    voice : function(req, res) {
      res.render('dev/voice.html', {
        layout : 'application',

        pageName : 'page-inner page-voice',

        currentUser : {},

        voiceInfo : {
          id: 1,
          title: 'Continued Effects of the Fukushima Disaster',
          description: '<p>On March 11, 2011, a tsunami and earthquake damaged the Fukushima Daiichi power plant in Fukushima, Japan. Subsequent equipment failures led to the release of nuclear material into the surrounding ground and ocean. Initially, studies conducted by TEPCO, the company operating the plant, concluded that the risks posed by the fallout were relatively small, and that radioactive material from the incident had been contained.</p>\
            <p>On July 22, 2013, it came to light that Fukushima Daiichi is still leaking into the Pacific Ocean, and that over 300 metric tons of contaminated water had been released since the disaster, posing a possible threat to ecosystems and public health.</p>',
          backgroundImage: '/img/sample/voices/cover-00.jpg',
          latitude: '',
          longitud: '',
          locationName : 'London, UK',
          ownerID: null,
          status: 'STATUS_PUBLIC',
          type: 'TYPE_PUBLIC',
          firstPostDate: '2010-03-30T13:59:47Z',
          lastPostDate: '2015-03-30T13:59:47Z',
          postCount: 1100,
          createdAt: '2015-03-30T13:59:47Z',
          updatedAt: '2015-03-30T13:59:47Z',

          author : {
            name : 'The Guardian',
            avatar : {
              medium: 'org-01.jpg',
              small : 'org-00.jpg'
            }
          }
        },

        /* =========================================================================== *
         *  POSTS
         * =========================================================================== */
        posts : require('./../public/demo-data/posts.js')
      });
    },

    profile : function(req, res) {
      var demoOrganizations = require('./../public/demo-data/organizations.js');
      var demoVoices = require('./../public/demo-data/voices.js');

      res.render('dev/profile.html', {
        layout : 'application',
        voices : demoVoices,
        organizations : demoOrganizations
      });
    },

    profileVoices : function(req, res) {
      var demoOrganizations = require('./../public/demo-data/organizations.js');
      var demoVoices = require('./../public/demo-data/voices.js');

      res.render('dev/profile-voices.html', {
        layout : 'application',
        voices : demoVoices,
        organizations : demoOrganizations
      });
    },

    profileSaved : function(req, res) {
      var demoOrganizations = require('./../public/demo-data/organizations.js');
      var demoVoices = require('./../public/demo-data/voices.js');
      var demoPosts = require('./../public/demo-data/posts.js');


      res.render('dev/profile-saved.html', {
        layout : 'application',
        voices : demoVoices,
        organizations : demoOrganizations,
        posts : demoPosts
      });
    },

    discover : function(req, res) {
      var demoOrganizations = require('./../public/demo-data/organizations.js');
      var demoVoices = require('./../public/demo-data/voices.js');

      res.render('dev/discover.html', {
        layout : 'application',
        voices : demoVoices,
        organizations : demoOrganizations
      });
    },

    discoverRecommended : function(req, res) {
      var demoOrganizations = require('./../public/demo-data/organizations.js');
      var demoVoices = require('./../public/demo-data/voices.js');

      res.render('dev/discover-recommended.html', {
        layout : 'application',
        voices : demoVoices,
        organizations : demoOrganizations
      });
    },

    discoverOnboarding : function(req, res) {
      res.render('dev/discover-onboarding.html', {
        layout : 'application'
      });
    },

    ui : function(req, res) {
      var demoVoices = require('./../public/demo-data/voices.js');
      var demoUsers = require('./../public/demo-data/users.js');

      res.render('dev/ui.html', {
        layout : 'application',
        voices : demoVoices,
        users : demoUsers
      });
    },

    kabinett : function(req, res) {
        res.render('test/index.html', {layout: 'application'});
    },

    signupIsProfileNameAvailable : function(req, res, next) {
      isProfileNameAvailable(req.body.profileName, function (err, result) {
        if (err) { return next(err); }

        if (result) {
          return res.json({ status: 'available' });
        } else {
          return res.json({ status: 'taken' });
        }
      });
    }
  }
});

module.exports = new HomeController();
