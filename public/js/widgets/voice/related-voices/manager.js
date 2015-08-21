/* Class ManageRelatedVoices
 * Handles the Related Voices (search/add/remove) for voices.
 * It should receive a `voices` Array via data to display the current related
 * voices lists. That array will be passed to the RelatedVoicesList widget
 * to render them.
 * This Widget also acts as a Controller because it will listen for when a voice
 * gets removed and it will also tell when a new voice was added.
 */
var Events = require('./../../../lib/events');
var API = require('./../../../lib/api');
var GeminiScrollbar = require('gemini-scrollbar');

Class(CV, 'ManageRelatedVoices').inherits(Widget)({
    ELEMENT_CLASS : 'cv-related-voices',
    HTML : '\
        <div>\
            <div data-main></div>\
            <div data-list-wrapper>\
                <div>\
                    <div class="cv-related-voices__list">\
                        <div class="gm-scrollbar -vertical"><span class="thumb"></span></div>\
                        <div class="gm-scrollbar -horizontal"><span class="thumb"></span></div>\
                        <div data-voices-list class="gm-scroll-view"></div>\
                    </div>\
                </div>\
            </div>\
        </div>',

    LABEL_HTML : '\
        <div class="form-field -mt2">\
            <label>Related Voices to “{title}”</label>\
        </div>',

    prototype : {
        data : {
            /* VoiceEntities Models
             * @property voices <required> [Array]
             */
            voices : null,
            /* Will include the search voices handler and the remove button on
             * each voice item.
             * @property editMode <optional> [Boolean]
             */
            editMode : false
        },

        /* Holds the data of the selected voice. (for editMode)
         */
        _selectedVoice : null,

        init : function(config){
            Widget.prototype.init.call(this, config);
            this.el = this.element[0];
            this._setup()._bindEvents();
        },

        /* Initialilize the custom scrollbars.
         * @method setup <public>
         */
        setup : function setup() {
            this.scrollbar = new GeminiScrollbar({
                element : this.el.querySelector('.cv-related-voices__list'),
                createElements : false
            }).create();
        },

        /* Creates and appends its children.
         * @return ManageRelatedVoices
         */
        _setup : function _setup() {
            if (!this.data.voices) {
                throw Error('ManageRelatedVoices require data.voices Array to be passed.');
            }

            if (this.data.editMode) {
                var labelString = this.constructor.LABEL_HTML;
                labelString = labelString.replace(/{title}/, this.data.voice.title);
                this.el.querySelector('[data-list-wrapper]').insertAdjacentHTML('afterbegin', labelString);

                this.appendChild(new CV.UI.InputButton({
                    name : 'searchInput',
                    data : {label : 'Add voices that are related to this voice (?)'},
                    inputData : {
                        inputClassName : '-lg -block -btrr0 -bbrr0',
                        attr : {
                            placeholder : 'Search voices...',
                            autofocus : true
                        }
                    },
                    buttonData : {
                        value : 'Add Voice',
                        className : 'primary'
                    }
                })).render(this.el.querySelector('[data-main]'));
                this.searchInput.button.disable();
            }

            this.appendChild(new CV.RelatedVoicesList({
                name : 'list',
                data : {
                    voices : this.data.voices,
                    editMode : this.data.editMode
                }
            })).render(this.el.querySelector('[data-voices-list]'));
            return this;
        },

        _bindEvents : function _bindEvents() {
            if (this.data.editMode && this.searchInput) {
                this._searchKeyUpHandlerRef = this._searchKeyUpHandler.bind(this);
                Events.on(this.searchInput.input.el, 'keyup', this._searchKeyUpHandlerRef);

                this._setSelectedUserRef = this._setSelectedUser.bind(this);
                this.searchInput.bind('results:item:clicked', this._setSelectedUserRef);
            }
        },

        /* Search Input Key Up Handler. Checks if we should call the searchVoices API endpoint.
         */
        _searchKeyUpHandler : function  _searchKeyUpHandler(ev) {
            if (ev.which === 40 || ev.which === 38 || ev.which === 13) {
                return;
            }

            var searchString = ev.target.value.trim().toLocaleLowerCase();
            if (!searchString || (searchString.length < 2)) {
                return;
            }

            this.searchInput.button.disable();
            this._selectedVoice = null;

            API.searchVoices({
                query : searchString,
                exclude : []
            }, this._searchVoicesResponseHandler.bind(this));
        },

        /* Handles the searchVoices API response.
         */
        _searchVoicesResponseHandler : function _searchVoicesResponseHandler(err, res) {
            console.log(err);
            console.log(res);

            this.searchInput.results.deactivate().clear();

            if (!res.voices.length) {
                return;
            }

            res.voices.forEach(function(voice) {
                this.searchInput.results.add({
                    element : new CV.VoiceCoverMiniClean({data: voice}).el,
                    data : voice
                });
            }, this);

            this.searchInput.results.activate();
        },

        /* Sets the this._selectedVoice data.
         */
        _setSelectedUser : function _setSelectedUser(ev) {
            this._selectedVoice = ev.data;

            this.searchInput.button.enable();
            this.searchInput.input.setValue(ev.data.title);
            this.searchInput.results.deactivate().clear();
        },

        destroy : function destroy() {
            if (this.scrollbar) {
                this.scrollbar = this.scrollbar.destroy();
            }

            if (this.searchInput) {
                Events.off(this.searchInput.input.el, 'keyup', this._searchKeyUpHandlerRef);
                this._searchKeyUpHandlerRef = null;
            }

            Widget.prototype.destroy.call(this);
            return null;
        }
    }
});
