/* globals App */
/* Handles the modetate window ui. Uses VoicePostLayersManager to create the layers and fill them with posts.
 */
var API = require('./../../../lib/api');

Class(CV, 'VoiceModerateManager').inherits(Widget).includes(CV.VoiceHelper)({
    HTML : '\
        <div class="voice-moderate-wrapper">\
            <div class="voice-posts-wrapper"></div>\
        </div>',

    prototype : {
        el : null,
        layersManager : null,
        _window : null,
        /* socket io instance holder */
        _socket : null,

        _resizeTimer : null,
        _resizeTime : 250,
        _listenScrollEvent : true,
        _lastScrollTop : 0,
        _scrollTimer : null,
        _scrollTime : 250,
        LAYER_CLASSNAME : 'cv-voice-posts-layer__detector',

        _publishedPosts : false,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.el = this.element[0];
            this.voicePostsWrapper = this.el.querySelector('.voice-posts-wrapper');
            this._window = window;
        },

        /* Public method to start the thing after being rendered.
         */
        setup : function setup() {
            this.appendChild(new CV.VoicePostLayersModerateAbstract({
                name : 'layersManager',
                id : App.Voice.data.id,
                postsCount : App.Voice.postsCountUnapproved,
                postCount : this._getTotalPostCount(App.Voice.postsCountUnapproved),
                scrollableArea : this.voicePostsWrapper,
                allowPostEditing : App.Voice.allowPostEditing,
                _socket : App.Voice._socket,
            })).render(this.voicePostsWrapper).setup().loadDefaultLayer();

            this.appendChild(new CV.VoiceModerateFooter({
                name : 'footer',
                totalPosts : this._getTotalPostCount(App.Voice.postsCountUnapproved)
            })).render(this.el);

            return this._bindEvents();
        },

        /* Subscribe the event handlers.
         * - footer done custom event
         * - ESC to close the widget
         */
        _bindEvents : function _bindEvents() {
            this.bind('post:moderate:delete', this._postModerateDelete.bind(this));

            this.bind('post:moderate:published', function () {
                this._publishedPosts = true;
            }.bind(this));

            this.footer.bind('done', this.destroy.bind(this));

            this._scrollHandlerRef = this._scrollHandler.bind(this);
            this.voicePostsWrapper.addEventListener('scroll', this._scrollHandlerRef);

            this._resizeHandlerRef = this._resizeHandler.bind(this);
            this._window.addEventListener('resize', this._resizeHandlerRef);

            this._windowKeydownHandlerRef = this._windowKeydownHandler.bind(this);
            this._window.addEventListener('keydown', this._windowKeydownHandlerRef);

            return this;
        },

        _postModerateDelete : function _postModerateDelete(ev) {
            API.postDelete({
                profileName : App.Voice.data.owner.profileName,
                voiceSlug : App.Voice.data.slug,
                postId : ev.data.parent.id
            }, function(err, res) {
                console.log(err);
                console.log(res);

                if (err) {
                    return;
                }

                setTimeout(function() {
                    var layer = ev.data.parent.parent;
                    ev.data.parent.destroy();
                    layer.reLayout();
                }.bind(this), 1000);
            }.bind(this));

            this._publishedPosts = true;
        },

        /* Handle the scrollableArea scroll event.
         * @method _scrollHandler <private> [Function]
         */
        _scrollHandler : function _scrollHandler() {
            var st = this.voicePostsWrapper.scrollTop;
            var scrollingUpwards = (st < this._lastScrollTop);
            var y = 1;
            var el;

            if (!this._listenScrollEvent) {
                return void 0;
            }

            if (!scrollingUpwards) {
                y = this.layersManager._windowInnerHeight - 1;
            }

            el = document.elementFromPoint(0, y);

            if (el.classList.contains(this.LAYER_CLASSNAME)) {
                if (el.dataset.date !== this.layersManager._currentMonthString) {
                    this.loadLayer(el.dataset.date, scrollingUpwards);
                }
            }

            this._lastScrollTop = st;

            if (this._scrollTimer) {
                this._window.clearTimeout(this._scrollTimer);
            }

            this._scrollTimer = this._window.setTimeout(function() {
                this.layersManager.loadImagesVisibleOnViewport();
            }.bind(this), this._scrollTime);
        },

        /* Handle the window resize event.
         * @method _resizeHandler <private> [Function]
         */
        _resizeHandler : function _resizeHandler() {
            var _this = this;

            if (this._resizeTimer) {
                this._window.clearTimeout(this._resizeTimer);
            }

            this._resizeTimer = this._window.setTimeout(function() {
                _this.layersManager.update();
            }, this._resizeTime);
        },

        /* Keydown handler, checks if the ESC key has been pressed to destroy the widget.
         * @method _windowKeydownHandler <private> [Function]
         */
        _windowKeydownHandler : function _windowKeydownHandler(ev) {
            var charCode = (typeof ev.which === 'number') ? ev.which : ev.keyCode;
            if (charCode === 27) {
                this.destroy();
            }
        },

        loadLayer : function loadLayer(dateString, scrollDirection) {
            this._listenScrollEvent = false;
            this.layersManager._beforeRequest(dateString, scrollDirection);
            this._listenScrollEvent = true;
        },

        destroy : function destroy() {
            Widget.prototype.destroy.call(this);

            this.voicePostsWrapper.removeEventListener('scroll', this._scrollHandlerRef);
            this._scrollHandlerRef = null;

            this._window.removeEventListener('resize', this._resizeHandlerRef);
            this._resizeHandlerRef = null;

            this._window.removeEventListener('keydown', this._windowKeydownHandlerRef);
            this._windowKeydownHandlerRef = null;

            this.el = null;
            this._window = null;

            if (this._publishedPosts) {
                window.location.reload();
            }

            return null;
        }
    }
});