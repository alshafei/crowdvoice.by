var mandrill = require('mandrill-api/mandrill');
var client = new mandrill.Mandrill(CONFIG.mandrill.key || false);

var message = {
  "html" : "",
  "subject" : "",
  "from_email" : "notifications@crowdvoice.by",
  "from_name"  : "CrowdVoice.by",
  "to" : [],
  "important" : true,
  "auto_text" : true,
  "inline_css": true,
}

var UserMailer = Module('UserMailer')({

  // Send Welcome email when creating a new user.
  new : function(user, entity, callback) {
    var mailer = this;

    var viewFile = application.fs.readFileSync('./views/mailers/user/new.html', 'utf8');

    var template = new Thulium({
      template : viewFile
    });

    template.parseSync().renderSync({user : user, entity : entity});

    var view = template.view;

    message.html = view;
    message.subject = "Welcome to CrowdVoice.by",
    message.to = [];

    message.to.push({
      "email" : user.email,
      "name" : entity.name + ' ' + entity.lastname,
      "type" : "to"
    })

    var async = true;
    var ip_pool = "Main Pool";

    client.messages.send({"message": message, "async": async}, function(result) {
        logger.log('UserMailer new():');
        logger.log(result);
        callback(null, result);

    }, function(e) {
        logger.error('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        callback(e);
    });
  },

  // Send Password reset instructions
  forgotPassword : function forgotPassword(user, callback) {
    var mailer = this;

    var viewFile = application.fs.readFileSync('./views/mailers/user/forgotPassword.html', 'utf8');

    var template = new Thulium({
      template : viewFile
    });

    template.parseSync().renderSync({user : user});

    var view = template.view;

    message.html = view;
    message.subject = "CrowdVoice.by - Instructions to reset your password.",
    message.to = [];

    message.to.push({
      "email" : user.email,
      "name" : user.email,
      "type" : "to"
    })

    var async = true;
    var ip_pool = "Main Pool";

    client.messages.send({"message": message, "async": async}, function(result) {
        logger.log('UserMailer forgotPassword():');
        logger.log(result);
        callback(null, result);

    }, function(e) {
        logger.error('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        callback(e);
    });
  }
});

module.exports = UserMailer;
