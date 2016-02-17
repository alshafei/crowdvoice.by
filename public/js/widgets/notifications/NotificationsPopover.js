var GeminiScrollbar = require('gemini-scrollbar')
  , Person = require('./../../lib/currentPerson')
  , API = require('./../../lib/api')
  , NotificationsStore = require('./../../stores/NotificationsStore')
  , Events = require('./../../lib/events');

Class(CV, 'NotificationsPopover').inherits(Widget).includes(BubblingSupport, CV.WidgetUtils)({
  ELEMENT_CLASS: 'notifications-popover-content',
  HTML: '\
    <div>\
      <header class="notifications-popover__header -clearfix">\
        <div class="-font-bold -upper -float-left">Notifications</div>\
        <div class="-float-right">\
          <a class="notifications-popover__header-settings" title="Manage notification settings">\
            <svg class="-s16">\
              <use xlink:href="#svg-settings"></use>\
            </svg>\
          </a>\
        </div>\
      </header>\
      <div class="notifications-popover__list -rel">\
        <div class="gm-scrollbar -vertical">\
          <div class="thumb"></div>\
        </div>\
        <div class="gm-scrollbar -horizontal">\
          <div class="thumb"></div>\
        </div>\
        <div class="notifications-popover__list-inner gm-scroll-view">\
        </div>\
      </div>\
      <div class="notifications-popover__footer">\
        <div class="cv-button-group multiple -row -full-width">\
          <button class="cv-button tiny -col-6 -font-semi-bold -btlr0">Mark All As Read</button>\
          <button class="cv-button tiny -col-6 -font-semi-bold -btrr0">View All</button>\
        </div>\
      </div>\
    </div>',

  prototype: {
    _latestScrollTop: 0,
    init: function init(config) {
      Widget.prototype.init.call(this, config);
      this.listElement = this.element[0].querySelector('.notifications-popover__list');
      this._setup()._bindEvents();
    },

    _setup: function _setup() {
      this.scrollbar = new GeminiScrollbar({
        element: this.listElement,
        createElements: false,
        autoshow: true
      }).create();

      this.appendChild(new CV.Loading({
        name: 'loader'
      })).render(this.scrollbar.getViewElement()).center();

      this.dom.updateAttr('href', this.element[0].querySelector('.notifications-popover__header-settings'), '/' + Person.get('profileName') + '/edit/#notifications');

      return this;
    },

    _bindEvents: function _bindEvents() {
      this._notificationsHandlerRef = this._notificationsHandler.bind(this);
      NotificationsStore.bind('notifications', this._notificationsHandlerRef);

      this._notificationMarkAsReadHandlerRef = this._notificationMarkAsReadHandler.bind(this);
      this.bind('notification:markAsReadAndRedirect', this._notificationMarkAsReadHandlerRef);

      this._scrollHandlerRef = this._scrollHandler.bind(this);
      Events.on(this.scrollbar.getViewElement(), 'scroll', this._scrollHandlerRef);
    },

    setup: function setup() {
      if (NotificationsStore._notifications) {
        NotificationsStore.getNotifications();
      } else {
        NotificationsStore.fetchNotifications();
      }
      return this;
    },

    /* NotificationsStore 'notifications' event handler.
     * @private
     * @param {Object} res
     * @property {Array} res.notifications
     */
    _notificationsHandler: function _notificationsHandler(res) {
      if (this.loader) {
        this.loader = this.loader.disable().remove();
      }

      this._latestScrollTop = this.scrollbar.getViewElement().scrollTop;

      while (this.children.length > 0) {
        this.children[0].destroy();
      }

      res.notifications.forEach(function (n) {
        this.appendChild(new CV.NotificationsPopoverItem({
          name: n.notificationId,
          data: n.action,
          notificationId: n.notificationId,
          read: n.read
        })).render(this.scrollbar.getViewElement());
      }, this);

      this.scrollbar.update().getViewElement().scrollTop = this._latestScrollTop;
    },

    /* NotificationItem 'notification:markAsRead' event handler.
     * @private
     */
    _notificationMarkAsReadHandler: function _notificationMarkAsReadHandler(ev) {
      ev.stopPropagation();
      NotificationsStore.decreaseUnseen();

      API.markNotificationAsRead({
        profileName: Person.get().profileName,
        data: {notificationId: ev.target.notificationId}
      }, function(err, res) {
        if (err) return console.log(res);
        if (ev.redirectUrl) {
          window.location = ev.redirectUrl;
        }
      });
    },

    /* List scrollbar event handler.
     * @private
     */
    _scrollHandler: function _scrollHandler(ev) {
      var el = ev.currentTarget;
      if ((el.scrollTop + el.clientHeight) >= el.scrollHeight) {
        NotificationsStore.fetchNotifications();
      }
    },

    destroy: function destroy() {
      Widget.prototype.destroy.call(this);
      NotificationsStore.unbind('notifications', this._notificationsHandlerRef);
      this._notificationsHandlerRef = null;
      Events.on(this.scrollbar.getViewElement(), 'scroll', this._scrollHandlerRef);
      this._scrollHandlerRef = null;
      this.scrollbar = this.scrollbar.destroy();
      return null;
    }
  }
});
