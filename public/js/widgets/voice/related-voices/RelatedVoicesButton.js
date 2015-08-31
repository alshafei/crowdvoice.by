/* Handles the `See Related Voices` button shown at the voice's footer.
 * No public methods, it will render the ManageRelatedVoices widget inside a
 * Modal when clicked. The ManageRelatedVoices widget will do everything itself.
 */
var Events = require('./../../../lib/events');

Class(CV, 'RelatedVoicesButton').inherits(Widget).includes(CV.WidgetUtils)({
    HTML : '<button class="cv-button tiny">See Related Voices</button>',
    prototype : {
        /* VoiceEntity data.
         * @property voice <required> [Object] (null)
         */
        voice : null,
        /* The voice is beign displayed for its owner?
         * @property editMode <optional> [Boolean] (false)
         */
        editMode : false,

        init : function init(config) {
            Widget.prototype.init.call(this, config);
            this.el = this.element[0];
            this._setup()._bindEvents();
        },

        /* Updates the Button text.
         * @method _setup <private>
         * @return RelatedVoicesButton
         */
        _setup : function _setup() {
            if (this.editMode) {
                this.dom.updateText(this.el, 'Manage Related Voices');
            }
            return this;
        },

        /* Subscribe its events.
         * @method _bindEvents <private>
         */
        _bindEvents : function _bindEvents() {
            this._clickHandlerRef = this._clickHandler.bind(this);
            Events.on(this.el, 'click', this._clickHandlerRef);
        },

        /* Button click handler.
         * @method _clickHandler <private>
         */
        _clickHandler : function _clickHandler() {
            if (this.relatedVoicesModal) {
                this.relatedVoicesModal = this.relatedVoicesModal.destroy();
            }

            if (this.editMode) {
                this.appendChild(new CV.UI.Modal({
                    name : 'relatedVoicesModal',
                    title : 'Manage Related Voices',
                    action : CV.ManageRelatedVoices,
                    width : 900,
                    data : {
                        voices : [],
                        editMode : true,
                        voice : this.voice
                    }
                })).render(document.body);
            } else {
                this.appendChild(new CV.UI.Modal({
                    name : 'relatedVoicesModal',
                    title : 'Related Voices',
                    action : CV.ManageRelatedVoices,
                    width : 900,
                    data : {voices : []}
                })).render(document.body);
            }

            this.relatedVoicesModal.bubbleAction.setup();

            requestAnimationFrame(function() {
                this.relatedVoicesModal.activate();
            }.bind(this));
        },

        /* Unsubscribe its events, nullify DOM references, destroy children, etc.
         * @method destroy <public> (inherited from Widget)
         */
        destroy : function destroy() {
            Widget.prototype.destroy.call(this);
            Events.off(this.el, 'click', this._clickHandlerRef);
            this._clickHandlerRef = null;
            return null;
        }
    }
});