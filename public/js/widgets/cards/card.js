/**
 * Card Widget (Display Entity Cards)
 *
 * backgrounds      {Object}
 *                  {big, bluredCard, card, original: {url}}
 * createdAt        {String} timestamp of registry creation
 * description      {String} entity description
 * id               {String} entity unique id
 * imageMeta        {Object} information about the avatar images
 *                  {card, icon, medium, notification, original, small: {channels, format, hasAlpha, hasProfile, height, space, width}}
 * images           {Object} entity's avatar images formats available
 *                  {card, icon, medium, notification, original, small: {url}}
 * isAnonymous      {Boolean} indicates if the entity's session has been started anonymously
 * lastname         {String} entity's lastname (only present for "users" not "organizations")
 * location         {String} entity's location name string
 * name             {String} entity's name
 * profileName      {String} entity's profile name
 * type             {String} ("organization", "user") indicates if the data belongs to an organization or user
 * updatedAt        {String} timestamp of last update
 * followersCount   {Number} Entity's followers total
 * voicesCount      {Number} Entity's published voices total
 * membershipCount  {Number} total of members (for 'organization' Entities)
 * followingCount   {Number} total of entities following
 * followed         {Boolean} Flag for currentPerson. Indicates if currentPerson is following this entity
 * voiceIds         {Array} Voice ids of voices this entity belongs or owns
 * organizationIds  {Array} Organization ids of organizations this entity belongs or owns
 */

var Person = require('./../../lib/currentPerson');
var moment = require('moment');

Class(CV, 'Card').inherits(Widget).includes(CV.WidgetUtils)({
    ELEMENT_CLASS : 'widget-card',
    HTML : '\
    <article role="article">\
        <div class="card-inner">\
            <div class="card_background-image-wrapper -img-cover -text-center">\
                <img class="card_avatar -rounded" alt="{{author.full_name}}’s avatar image"/>\
                <p class="card_username -rel">\
                    <a class="card_username-link"></a>\
                </p>\
                <h3 class="card_fullname -rel -font-bold">OpenGovFoundation</h3>\
                <div class="card_stats -rel"></div>\
            </div>\
            <div class="card_info-wrapper">\
                <p class="card_description"></p>\
                <div class="card_meta">\
                    <div class="card_meta-location -inline">\
                        <svg class="card_meta-svg">\
                            <use xlink:href="#svg-location"></use>\
                        </svg>\
                        <span class="card_meta-location-text"></span>\
                    </div>\
                    <div class="card_meta-joined-at -inline">\
                        <svg class="card_meta-svg">\
                            <use xlink:href="#svg-clock"></use>\
                        </svg>\
                        <time class="card_meta-joined-at-text" datetime=""></time>\
                    </div>\
                </div>\
            </div>\
            <div class="card_actions">\
                <div class="-row -full-height"></div>\
            </div>\
        </div>\
    </article>\
    ',

    HTML_STATS_ORGANIZATION : '\
        <div class="-row">\
            <div class="card-stat-item -col-3">\
                <p class="stats-number card_total-voices-text -font-bold"></p>\
                <p class="stats-label card_total-voices-label-text">Voices</p>\
            </div>\
            <div class="card-stat-item -col-3">\
                <p class="stats-number card_total-followers-text -font-bold"></p>\
                <p class="stats-label card_total-followers-label-text">Followers</p>\
            </div>\
            <div class="card-stat-item -col-3">\
                <p class="stats-number card_total-following-text -font-bold"></p>\
                <p class="stats-label card_total-following-label-text">Following</p>\
            </div>\
            <div class="card-stat-item -col-3 card_collaborations-wrapper">\
                <p class="stats-number card_collaborations-text -font-bold"></p>\
                <p class="stats-label card_collaborations-label-text">Members</p>\
            </div>\
        </div>',

    HTML_STATS_PERSON : '\
        <div class="-row">\
            <div class="card-stat-item -col-3">\
                <p class="stats-number card_total-voices-text -font-bold"></p>\
                <p class="stats-label card_total-voices-label-text">Voices</p>\
            </div>\
            <div class="card-stat-item -col-3">\
                <p class="stats-number card_total-followers-text -font-bold"></p>\
                <p class="stats-label card_total-followers-label-text">Followers</p>\
            </div>\
            <div class="card-stat-item -col-3">\
                <p class="stats-number card_total-following-text -font-bold"></p>\
                <p class="stats-label card_total-following-label-text">Following</p>\
            </div>\
        </div>',

    MAX_DESCRIPTION_LENGTH : 180,

    prototype : {
        followersCount : 0,
        followingCount : 0,
        voicesCount : 0,
        membershipCount : 0,
        /* is currentPerson following this entity? */
        followed : false,

        _totalCountActions : 0,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.el = this.element[0];

            this.profileCoverEl = this.el.querySelector('.card_background-image-wrapper');
            this.avatarEl = this.el.querySelector('.card_avatar');
            this.usernameEl = this.el.querySelector('.card_username-link');
            this.fullNameEl = this.el.querySelector('.card_fullname');
            this.statsWrapper = this.el.querySelector('.card_stats');
            this.descriptionEl = this.el.querySelector('.card_description');
            this.locationEl = this.el.querySelector('.card_meta-location-text');
            this.joinedAtEl = this.el.querySelector('.card_meta-joined-at-text');
            this.actionsEl = this.el.querySelector('.card_actions .-row');

            if (this.data.type === "organization") {
                this.statsWrapper.insertAdjacentHTML('afterbegin', this.constructor.HTML_STATS_ORGANIZATION);
                this._setupOrganizationElements();
            } else {
                this.statsWrapper.insertAdjacentHTML('afterbegin', this.constructor.HTML_STATS_PERSON);
                this._setupUserElements();
            }

            this._setupDefaultElements();
            this._addActionButtons();
        },

        /* Adds the necessary action buttons automatically - per user's role-based (follow, message, invite to, join, etc).
         * @method _addActionButtons <private> [Function]
         * @return CV.Card [Object]
         */
        _addActionButtons : function _addActionButtons() {
            if (!Person.get()) {
                return void 0;
            }

            if (Person.is(this.data.id) || Person.anon()) {
                return void 0;
            }

            if (!Person.ownerOf('organization', this.data.id)) {
                this.appendChild( new CV.CardActionFollow({
                    name : 'followButton',
                    followed: this.data.followed,
                    profileName : this.data.profileName
                })).render(this.actionsEl);
                this._totalCountActions++;

                this.appendChild(new CV.CardActionMessage({
                    name : 'messageButton',
                    id : this.data.id
                })).render(this.actionsEl);
                this._totalCountActions++;
            }

            if (this.data.type === "organization") {
                if (!Person.memberOf('organization', this.data.id)) {
                    this.appendChild(new CV.CardActionJoin({name : 'joinButton'})).render(this.actionsEl);
                    this._totalCountActions++;
                }
            } else {
                if (Person.canInviteEntity(this.data)) {
                    this.appendChild(new CV.CardActionInvite({
                        name : 'inviteButton',
                        entity : this.data
                    })).render(this.actionsEl);
                    this._totalCountActions++;
                }
            }

            var n = 12 / this._totalCountActions;
            [].slice.call(this.el.querySelectorAll('.card-actions-item'), 0).forEach(function(item) {
                item.classList.add('-col-' + n);
            });

            this.el.classList.add('has-actions');

            return this;
        },

        /**
         * Update its content with the received data.
         * @method _setupDefaultElements <private> [Function]
         * @return Card [Object]
         */
        _setupDefaultElements : function _setupDefaultElements() {
            this.dom.updateBgImage(this.profileCoverEl, this.data.backgrounds.card.url);

            this.dom.updateAttr('src', this.avatarEl, this.data.images.card.url);
            this.dom.updateAttr('alt', this.avatarEl, this.data.profileName + "’s avatar image");

            this.dom.updateText(this.usernameEl, "@" + this.data.profileName);
            this.dom.updateAttr('href', this.usernameEl, '/' + this.data.profileName);

            var fullname = this.data.name + (this.data.lastname ? (' ' + this.data.lastname) : '');
            this.dom.updateText(this.fullNameEl, fullname);

            var description = this.format.truncate(this.data.description, this.constructor.MAX_DESCRIPTION_LENGTH, true);
            this.dom.updateText(this.descriptionEl, description);
            this.dom.updateText(this.locationEl, this.data.location);
            this.dom.updateText(this.joinedAtEl, moment(this.data.createdAt).format('MMM YYYY'));

            this.dom.updateText(this.statsWrapper.querySelector('.card_total-voices-text'), this.format.numberUS(this.data.voicesCount));
            this.dom.updateText(this.statsWrapper.querySelector('.card_total-followers-text'), this.format.numberUS(this.data.followersCount));
            this.dom.updateText(this.statsWrapper.querySelector('.card_total-following-text'), this.format.numberUS(this.data.followingCount));

            return this;
        },

        _setupOrganizationElements : function _setupOrganizationElements() {
            this.dom.updateText(
                this.statsWrapper.querySelector('.card_collaborations-text'),
                this.format.numberUS(this.data.membershipCount)
            );

            return this;
        },

        _setupUserElements : function _setupUserElements() {
            return this;
        }
    }
});
