/* jshint multistr: true */
Class(CV, 'NotificationRequest').inherits(CV.Notification)({
    ELEMENT_CLASS : 'cv-notification request',
    HTML : '\
        <div>\
            <div class="cv-notification__info">\
                <div class="cv-notification__info-main">\
                    <img class="main-avatar -rounded" src="/img/sample/covers/feat-00.jpg">\
                    <p class="main-text"></p>\
                </div>\
                <div class="cv-notification__info-extra"></div>\
            </div>\
            <div class="cv-notification__close -clickable -abs -full-height">\
                <svg class="-s9">\
                    <use xlink:href="#svg-close"></use>\
                </svg>\
            </div>\
        </div>\
    ',

    prototype : {
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.el = this.element[0];
            this.mainAvatarElement = this.el.querySelector('.main-avatar');
            this.mainText = this.el. querySelector('.main-text');
            this.extraInfoElement = this.el.querySelector('.cv-notification__info-extra');

            this.dom.updateAttr('src', this.mainAvatarElement, this.person.images.small.url);
            this.dom.updateText(this.mainText, this.person.name + ' ' + this.person.lastname + ' has requested to join your Organization:');

            this.appendChild(
                new CV.CardMini({data: this.organizationInfo})
            ).render(this.extraInfoElement);

            console.log('request');
        }
    }
});