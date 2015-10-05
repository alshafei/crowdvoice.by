var mandrill = require('mandrill-api/mandrill'),
  client = new mandrill.Mandrill(CONFIG.mandrill.key || false)

var notificationViewFile = fs.readFileSync('./views/mailers/notification/notification.html', 'utf8'),
  newMessageViewFile = fs.readFileSync('./views/mailers/notification/newMessage.html', 'utf8'),
  newInvitationViewFile = fs.readFileSync('./views/mailers/notification/newInvitation.html', 'utf8'),
  newRequestViewFile = fs.readFileSync('./views/mailers/notification/newRequest.html', 'utf8'),
  newFollowerViewFile = fs.readFileSync('./views/mailers/notification/newFollower.html', 'utf8')

var NotificationMailer = Module('NotificationMailer')({

  // Send feed notification with email
  notification: function (user, notificationInfo, callback) {
    var template = new Thulium({ template: notificationViewFile }),
      message = {
        html: '',
        subject: 'CrowdVoice.by - You have a new notification',
        from_email: 'notifications@crowdvoice.by',
        from_name: 'CrowdVoice.by',
        to: [],
        important: true,
        auto_text: true,
        inline_css: true,
      }

    template.parseSync().renderSync({
      params: {
        user: user,
        notificationInfo: notificationInfo,
      },
    })

    var view = template.view

    message.html = view
    message.to = [] // reset

    message.to.push({
      email: user.email,
      name: user.name,
      type: 'to'
    })

    client.messages.send({ message: message, async: true }, function (result) {
      logger.log('NotificationMailer notification():')
      logger.log(result)

      return callback(null, result)
    }, function (err) {
      logger.err('NotificationMailer notification(): A mandrill error occurred: ' + err.name + ' - ' + err.message)
      return callback(err)
    })
  },

  // Send notification about new message
  newMessage: function (user, messageInfo, callback) {
    var template = new Thulium({ template: newMessageViewFile }),
      message = {
        html: '',
        subject: 'CrowdVoice.by - You have received a new message from ' + messageInfo.sender, // TODO placeholder
        from_email: 'notifications@crowdvoice.by',
        from_name: 'CrowdVoice.by',
        to: [],
        important: true,
        auto_text: true,
        inline_css: true,
      }

    template.parseSync().renderSync({
      params: {
        user: user,
        messageInfo: messageInfo,
      },
    })

    var view = template.view

    message.html = view
    message.to = [] // reset

    message.to.push({
      email: user.email,
      name: user.name,
      type: 'to'
    })

    client.messages.send({ message: message, async: true }, function (result) {
      logger.log('NotificationMailer newMessage():')
      logger.log(result)

      return callback(null, result)
    }, function (err) {
      logger.err('NotificationMailer newMessage(): A mandrill error occurred: ' + err.name + ' - ' + err.message)
      return callback(err)
    })
  },

  // Send on new invitation
  newInvitation: function (user, messageInfo, callback) {
    var template = new Thulium({ template: newInvitationViewFile }),
      message = {
        html: '',
        subject: 'CrowdVoice.by - You have received a new invitation from ' + messageInfo.sender, // TODO placeholder
        from_email: 'notifications@crowdvoice.by',
        from_name: 'CrowdVoice.by',
        to: [],
        important: true,
        auto_text: true,
        inline_css: true,
      }

    template.parseSync().renderSync({
      params: {
        user: user,
        messageInfo: messageInfo,
      },
    })

    var view = template.view

    message.html = view
    message.to = [] // reset

    message.to.push({
      email: user.email,
      name: user.name,
      type: 'to'
    })

    client.messages.send({ message: message, async: true }, function (result) {
      logger.log('NotificationMailer newInvitation():')
      logger.log(result)

      return callback(null, result)
    }, function (err) {
      logger.err('NotificationMailer newInvitation(): A mandrill error occurred: ' + err.name + ' - ' + err.message)
      return callback(err)
    })
  },

  // Send on new request
  newRequest: function (user, messageInfo, callback) {
    var template = new Thulium({ template: newRequestViewFile }),
      message = {
        html: '',
        subject: 'CrowdVoice.by - You have received a new request from ' + messageInfo.sender, // TODO placeholder
        from_email: 'notifications@crowdvoice.by',
        from_name: 'CrowdVoice.by',
        to: [],
        important: true,
        auto_text: true,
        inline_css: true,
      }

    template.parseSync().renderSync({
      params: {
        user: user,
        messageInfo: messageInfo,
      },
    })

    var view = template.view

    message.html = view
    message.to = [] // reset

    message.to.push({
      email: user.email,
      name: user.name,
      type: 'to'
    })

    client.messages.send({ message: message, async: true }, function (result) {
      logger.log('NotificationMailer newRequest():')
      logger.log(result)

      return callback(null, result)
    }, function (err) {
      logger.err('NotificationMailer newRequest(): A mandrill error occurred: ' + err.name + ' - ' + err.message)
      return callback(err)
    })
  },

  // Send on new follow (of you or your voice)
  newFollower: function (user, newFollowerEntity, callback) {
    var template = new Thulium({ template: newFollowerViewFile }),
      message = {
        html: '',
        subject: 'CrowdVoice.by - You have a new follower',
        from_email: 'notifications@crowdvoice.by',
        from_name: 'CrowdVoice.by',
        to: [],
        important: true,
        auto_text: true,
        inline_css: true,
      }

    template.parseSync().renderSync({
      params: {
        user: user,
        messageInfo: messageInfo,
      },
    })

    var view = template.view

    message.html = view
    message.to = [] // reset

    message.to.push({
      email: user.email,
      name: user.name,
      type: 'to'
    })

    client.messages.send({ message: message, async: true }, function (result) {
      logger.log('NotificationMailer newFollower():')
      logger.log(result)

      return callback(null, result)
    }, function (err) {
      logger.err('NotificationMailer newFollower(): A mandrill error occurred: ' + err.name + ' - ' + err.message)
      return callback(err)
    })
  },

})

module.exports = NotificationMailer
