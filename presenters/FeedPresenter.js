'use strict'

var EntitiesPresenter = require('./EntitiesPresenter.js')
var VoicesPresenter = require('./VoicesPresenter.js')

var FeedPresenter = Module('FeedPresenter')({
  build: function (feedActions, currentPerson, forNotifications, callback) {
    var result = []

    async.series([
      // check if it's for notifications
      // if it is then we'll replace feedActions (which is what the presenter
      // works on) with a new feedActions that only has nactions the user hasn't
      // read
      function (next) {
        if (forNotifications) {
          Notification.find({
            follower_id: hashids.decode(currentPerson.id)[0],
            read: false,
          }, function (err, notifications) {
            if (err) { return next(err) }

            var actionIds = notifications.map(function (val) { return val.actionId })

            FeedAction.whereIn('id', actionIds, function (err, actions) {
              if (err) { return next(err) }

              feedActions = actions

              return next()
            })
          })
        } else {
          return next()
        }
      },
    ], function (err) {
      if (err) { return callback(err) }

      async.eachLimit(feedActions, 1, function (action, next) {
        var actionInst = new FeedAction(action)

        async.series([
          // feed action ID
          function (next) {
            actionInst.id = hashids.encode(action.id)[0]

            return next()
          },

          // itemType and itemId
          function (next) {
            if (action.itemType === 'voice') {
              Voice.find({ id: action.itemId }, function (err, voice) {
                if (err) { return next(err) }

                VoicesPresenter.build(voice, currentPerson, function (err, presentedVoice) {
                  if (err) { return next(err) }

                  actionInst.voice = presentedVoice[0]

                  return next()
                })
              })
            } else if (action.itemType === 'entity') {
              Entity.find({ id: action.itemId }, function (err, entity) {
                if (err) { return next(err) }

                EntitiesPresenter.build(entity, currentPerson, function (err, presentedEntity) {
                  if (err) { return next(err) }

                  actionInst.entity = presentedEntity[0]

                  return next()
                })
              })
            }

            actionInst.itemId = hashids.encode(action.itemId)[0]
          },

          // actionDoer
          function (next) {
            Entity.find(['id = ?', [action.who]], function (err, entity) {
              if (err) { return next(err) }

              EntitiesPresenter.build(entity, currentPerson, function (err, presentedEntity) {
                if (err) { return next(err) }

                // it is `actionDoer` and not `who` because the frontend already
                // implemented functionality for this using `actionDoer`
                actionInst.actionDoer = presentedEntity[0]

                return next()
              })
            })
          },
        ], function (err) {
          if (err) { return callback(err) }

          result.push(actionInst)

          return next()
        })
      }, function (err) {
        if (err) { return callback(err) }

        return callback(null, result)
      })
    })
  },
})

module.exports = FeedPresenter