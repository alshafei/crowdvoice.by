// This code loads before neonode-core is required and executed
// Put here anything you need before neonode-core
// If you need something to load after neonode-core put it in bin/server.js

// require('long-stack-traces');

var gitrev = require('git-revision');

if (!CONFIG.gitRevision) {
  CONFIG.gitRevision = gitrev('short');
}

global.Admin = {};
global.K = {};

// Custom Errors
global.NotFoundError = function NotFoundError(message) {
  this.name = 'NotFoundError';
  this.message = message || 'Not Found';
};

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

global.ForbiddenError = function ForbiddenError(message) {
  this.name = 'ForbiddenError';
  this.message = message || 'Not Authorized';
};

ForbiddenError.prototype = Object.create(Error.prototype);
ForbiddenError.prototype.constructor = ForbiddenError;

// Load aws-sdk and S3
var AWS = require('aws-sdk');
global.amazonS3 = new AWS.S3(CONFIG.s3);

// Load image processors
global.gm = require('gm');
global.sharp = require('sharp');

// Load underscore
global._ = require('underscore');

// Load moment
global.moment = require('moment');

// Load Promise
global.Promise = require('bluebird');

global.useGM = false;

// ACL
global.ACL = require('./../lib/ACL/ACL.js');
require('./../lib/ACL/visitor.js');
require('./../lib/ACL/anonymous.js');
require('./../lib/ACL/person.js');
require('./../lib/ACL/admin.js');

// Load request
var r = require('request');
global.request = r.defaults({
  followRedirect : true,
  followAllRedirects : true,
  maxRedirects : 10,
  headers: {
    'User-Agent': 'Chrome'
  },
  jar : true,
  timeout : 5000
});

if (CONFIG.enableLithium) {
  // require('./../mailers/LithiumMailer.js');
  require('./../lib/LithiumEngine');
}

global.FB = require('facebook-node');
FB.setAccessToken(CONFIG.facebook.token);
