Class(CV, 'NotificationsManager').inherits(Widget)({
    ELEMENT_CLASS : 'cv-notifications',

    HTML : '\
        <div>\
            <div class="cv-notifications-container">\
                <div class="cv-notifications-all">\
                </div>\
            </div>\
        </div>\
    ',

    prototype : {
        notifications   : null,
        open            : false,

        _container : document.body,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.el = this.element[0].querySelector(".cv-notifications-container");
            this.elAll = this.element[0].querySelector(".cv-notifications-all");


            if (this.notifications) this._renderNotifications();
        },

        _renderNotifications : function _renderNotifications() {
            slicedNotifications = this.notifications.slice(0, 4);
            slicedNotifications.forEach(function(n) {
                this.appendChild(CV.Notification.create(n.action, n.notificationId)).render(this.elAll);
            }, this);

            this.appendChild(CV.Notification.create({action:'ReadMore'})).render(this.el);

        },

        update : function update(notifications){
            this.element.find('.cv-notifications-all').empty();
            slicedNotifications = notifications.slice(0, 4);
            slicedNotifications.forEach(function(n) {
                this.appendChild(CV.Notification.create(n.action, n.notificationId)).render(this.elAll);
            }, this);
        },

        show : function show () {
            this.element.slideDown(250);
            this.open = true;
        },

        hide : function hide () {
            this.element.slideUp(150);
            this.open = false;
        }
    }
});
