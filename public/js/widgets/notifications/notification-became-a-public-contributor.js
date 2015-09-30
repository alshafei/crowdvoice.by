/* jshint multistr: true */
Class(CV, 'NotificationBecameAPublicContributor').inherits(CV.Notification)({
    ELEMENT_CLASS : 'cv-notification became-contributor',
    HTML : '\
        <div>\
            <div class="cv-notification__info">\
                <div class="cv-notification__info-main">\
                    <img class="main-avatar -rounded">\
                    <p class="main-text"></p>\
                    <div class="notification-entity-voice"></div>\
                </div>\
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
            this.mainText = this.el.querySelector('.main-text');
            this.entityVoice = this.el.querySelector('.notification-entity-voice');

            this.dom.updateAttr('src', this.mainAvatarElement, this.actionDoer.images.small.url);

            if(this.itemType == 'entity'){
                new CV.CardMini({data:this.entity}).render(this.entityVoice);
                this.dom.updateText(this.mainText, this.actionDoer.name + ' ' + this.actionDoer.lastname + ' became a public contributor of:');
            } else if (this.itemType == 'voice'){
                new CV.VoiceCoverMini({data:this.voice}).render(this.entityVoice);
                this.dom.updateText(this.mainText, this.actionDoer.name + ' ' + this.actionDoer.lastname + ' became a public contributor of:');
            }

            //console.log('created');

        }
    }
});
