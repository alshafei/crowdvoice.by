'use strict'

global.Admin = {}

var application = require('neonode-core')
require(path.join(__dirname, '../../lib/routes.js'))

// Load moment
global.moment = require('moment')

global.FeedInjector = require(path.join(__dirname, '../../lib/FeedInjector.js'))
require(path.join(__dirname, '../../presenters/PostsPresenter'))

application._serverStart()

// COMMENT IF YOU WANT LOGGER OUTPUT
logger.log = function () {}

var login = require(path.join(__dirname, 'login.js')),
  expect = require('chai').expect

CONFIG.database.logQueries = false

var urlBase = 'http://localhost:3000'

describe('MessagesController', function () {

  describe('#create', function () {

    it('Create message in pre-existing conversation', function (done) {
      login('tyrion-lannister', function (err, agent, csrf) {
        if (err) { return done(err) }

        agent
          .post(urlBase + '/tyrion-lannister/messages/' + hashids.encode(1)) // NOTE: thread ID changes
          .accept('application/json')
          .send({
            _csrf: csrf,
            message: 'So anyway, weird conversation huh?',
          })
          .end(function (err, res) {
            if (err) { return done(err) }

            expect(res.status).to.equal(200)

            return done()
          })
      })
    })

    it('Creating message in empty, pre-existing thread should not crash NotificationMailer', function (doneTest) {
      async.series([
        function (nextSeries) {
          login('arya-stark', function (err, agent, csrf) {
            if (err) { return nextSeries(err) }

            agent
              .post(urlBase + '/arya-stark/messages')
              .accept('application/json')
              .send({
                _csrf: csrf,
                type: 'message',
                senderEntityId: hashids.encode(11), // Arya
                receiverEntityId: hashids.encode(3), // Cersei
                message: 'Just a test, you know the drill'
              })
              .end(function (err, res) {
                if (err) { return nextSeries(err) }

                expect(res.status).to.equal(200)

                return nextSeries()
              })
          })
        },

        function (nextSeries) {
          db('Messages')
            .where('thread_id', '=', 2)
            .del()
            .exec(nextSeries)
        },

        function (nextSeries) {
          login('arya-stark', function (err, agent, csrf) {
            if (err) { return nextSeries(err) }

            agent
              .post(urlBase + '/arya-stark/messages')
              .accept('application/json')
              .send({
                _csrf: csrf,
                type: 'message',
                senderEntityId: hashids.encode(11), // Arya
                receiverEntityId: hashids.encode(3), // Cersei
                message: 'Just a test, you know the drill'
              })
              .end(function (err, res) {
                if (err) { return nextSeries(err) }

                expect(res.status).to.equal(200)

                return nextSeries()
              })
          })
        },
      ], doneTest)
    })

    it('MessageThread.createMessage should mark the thread as not hidden', function (doneTest) {
      async.series([
        // robert to jamie
        function (nextSeries) {
          login('robert-baratheon', function (err, agent, csrf) {
            if (err) { return nextSeries(err) }

            agent
              .post(urlBase + '/robert-baratheon/messages')
              .accept('application/json')
              .send({
                _csrf: csrf,
                type: 'message',
                senderEntityId: hashids.encode(17), // Robert
                receiverEntityId: hashids.encode(5), // Jamie
                message: 'This\'ll be deleted in the near future...'
              })
              .end(function (err, res) {
                if (err) { return nextSeries(err) }

                expect(res.status).to.equal(200)

                return nextSeries()
              })
          })
        },

        // jamie answer
        function (nextSeries) {
          login('jamie-lannister', function (err, agent, csrf) {
            if (err) { return nextSeries(err) }

            agent
              .post(urlBase + '/jamie-lannister/messages')
              .accept('application/json')
              .send({
                _csrf: csrf,
                type: 'message',
                senderEntityId: hashids.encode(5), // Jamie
                receiverEntityId: hashids.encode(17), // Robert
                message: 'This\'ll also be deleted in the near future...'
              })
              .end(function (err, res) {
                if (err) { return nextSeries(err) }

                expect(res.status).to.equal(200)

                return nextSeries()
              })
          })
        },

        // jamie delete
        function (nextSeries) {
          login('jamie-lannister', function (err, agent, csrf) {
            if (err) { return nextSeries(err) }

            agent
              .del(urlBase + '/jamie-lannister/messages/' + hashids.encode(4))
              .accept('application/json')
              .send({
                _csrf: csrf,
              })
              .end(function (err, res) {
                if (err) { return nextSeries(err) }

                expect(res.status).to.equal(200)

                return nextSeries()
              })
          })
        },

        // robert to jamie
        function (nextSeries) {
          login('robert-baratheon', function (err, agent, csrf) {
            if (err) { return nextSeries(err) }

            agent
              .post(urlBase + '/robert-baratheon/messages/' + hashids.encode(4)) // NOTE: thread ID changes
              .accept('application/json')
              .send({
                _csrf: csrf,
                message: 'It got deleted.  This is an entirely new conversation for you.'
              })
              .end(function (err, res) {
                if (err) { return nextSeries(err) }

                expect(res.status).to.equal(200)

                return nextSeries()
              })
          })
        },
      ], function (err) {
        if (err) { return doneTest(err) }

        MessageThread.findById(4, function (err, thread) { // NOTE: thread ID changes
          if (err) { return doneTest(err) }

          expect(thread[0].hiddenForSender).to.equal(false)
          expect(thread[0].hiddenForReceiver).to.equal(false)

          return doneTest()
        })
      })
    })

  })

  describe('#answerInvite', function () {

    it('"Accept > Leave > Accept > Error" shouldn\'t happen', function (done) {
      async.series([
        function (nextSeries) {
          login('cersei-lannister', function (err, agent, csrf) {
            if (err) { return nextSeries(err) }

            agent
              .post(urlBase + '/cersei-lannister/messages')
              .accept('application/json')
              .send({
                _csrf: csrf,
                type: 'invitation_organization',
                senderEntityId: hashids.encode(3), // Cersei
                receiverEntityId: hashids.encode(17), // Robert
                organizationId: hashids.encode(22), // House Lannister
                message: 'I think this is an offer you cannot turn down...',
              })
              .end(function (err, res) {
                if (err) { return nextSeries(err) }

                expect(res.status).to.equal(200)

                return nextSeries()
              })
          })
        },

        function (nextSeries) {
          login('robert-baratheon', function (err, agent, csrf) {
            if (err) { return nextSeries(err) }

            agent
              .post(urlBase + '/robert-baratheon/messages/' + hashids.encode(5) + '/' + hashids.encode(14) + '/answerInvite') // NOTE: IDs changes
              .accept('application/json')
              .send({
                _csrf: csrf,
                action: 'accept',
              })
              .end(function (err, res) {
                if (err) { return nextSeries(err) }

                expect(res.status).to.equal(200)

                return nextSeries()
              })
          })
        },

        function (nextSeries) {
          login('robert-baratheon', function (err, agent, csrf) {
            if (err) { return nextSeries(err) }

            agent
              .post(urlBase + '/robert-baratheon/leaveOrganization')
              .accept('application/json')
              .send({
                _csrf: csrf,
                orgId: hashids.encode(22), // House Lannister
                entityId: hashids.encode(17), // Robert
              })
              .end(function (err, res) {
                if (err) { return nextSeries(err) }

                expect(res.status).to.equal(200)

                return nextSeries()
              })
          })
        },

        function (nextSeries) {
          login('cersei-lannister', function (err, agent, csrf) {
            if (err) { return nextSeries(err) }

            agent
              .post(urlBase + '/cersei-lannister/messages')
              .accept('application/json')
              .send({
                _csrf: csrf,
                type: 'invitation_organization',
                senderEntityId: hashids.encode(3), // Cersei
                receiverEntityId: hashids.encode(17), // Robert
                organizationId: hashids.encode(22), // House Lannister
                message: 'I think this is an offer you cannot turn down...',
              })
              .end(function (err, res) {
                if (err) { return nextSeries(err) }

                expect(res.status).to.equal(200)

                return nextSeries()
              })
          })
        },

        function (nextSeries) {
          login('robert-baratheon', function (err, agent, csrf) {
            if (err) { return nextSeries(err) }

            agent
              .post(urlBase + '/robert-baratheon/messages/' + hashids.encode(5) + '/' + hashids.encode(15) + '/answerInvite') // NOTE: IDs changes
              .accept('application/json')
              .send({
                _csrf: csrf,
                action: 'accept',
              })
              .end(function (err, res) {
                if (err) { return nextSeries(err) }

                expect(res.status).to.equal(200)

                return nextSeries()
              })
          })
        },

      ], done)
    })

  })

})
