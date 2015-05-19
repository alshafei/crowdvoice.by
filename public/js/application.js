require('neon');
require('neon/stdlib');

var jQuery = require('./vendor/jquery-2.0.3.js');
window.jQuery = jQuery;
window.$ = jQuery;

// our namespace
window.CV = {};

require('../../lib/js/widget-utils.js');
require('./vendor/Widget.js');

window.validate = require('validate');
window.soundManager = require('SoundManager2').soundManager;

require('./../css/style.less');

// widgets
require('./widgets/popover.js');
require('./widgets/popover-request-to-contribute.js');
require('./widgets/responsive-slider.js');

// components
require('./widgets/card.js');
require('./widgets/voice-cover.js');
require('./widgets/voice-cover-mini.js');
require('./widgets/category-cover.js');

require('./views/voice');
require('./widgets/voice-post-layers-manager');
require('./widgets/voice-posts-layer');
require('./widgets/post.js');
require('./widgets/post-image.js');
require('./widgets/post-video.js');
require('./widgets/post-audio.js');
require('./widgets/post-link.js');
require('./widgets/post-quote.js');
require('./widgets/button.js');
require('./widgets/check.js');
require('./widgets/input.js');
require('./widgets/select.js');
require('./widgets/bubble.js');
require('./widgets/bubble/jump-to-date.js');
require('./widgets/bubble/voices-list.js');
require('./widgets/bubble/share.js');
require('./widgets/bubble/help.js');
require('./widgets/notification.js');

require('./widgets/audio.js');
