
/* Creates the layers, handle the data requests and fill them with posts.
 */
var moment = require('moment');
var Velocity = require('velocity-animate');

Class(CV, 'VoicePostLayers').inherits(Widget)({
    HTML : '<section class="voice-posts -rel"></section>',

    prototype : {
        /* DEFAULT BASIC OPTIONS */
        description : '',
        postsCount : null,
        firstPostDate : '',
        lastPostDate : '',
        averagePostTotal : 100,
        averagePostWidth : 300,
        averagePostHeight : 600,
        scrollableArea : null,

        /* PRIVATE PROPERTIES */
        el : null,
        _window : null,
        /* socket io instance holder */
        _socket : null,
        /* holds the references of the VoicePostsLayer children instances */
        _layers : null,
        _cachedData : null,
        _currentMonthString : '',
        _availableWidth : 0,
        _windowInnerHeight : 0,
        _windowInnerWidth : 0,
        _averageLayerHeight : 0,
        _isInitialLoad : true,
        _lazyLoadingImageArray: null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.el = this.element[0];
            this._window = window;
            this._socket = this._socket || this.parent._socket;
            this._layers = [];
            this._cachedData = {};
            this._lazyLoadingImageArray = [];
        },

        setup : function setup() {
            this._setGlobarVars();
            this._createEmptyLayers();
            return this._bindEvents().__bindEvents();
        },

        _bindEvents : function _bindEvents() {
            this._loadLayerRef = this.loadLayer.bind(this);

            this._jumpToHandlerRef = this._jumpToHandler.bind(this);
            CV.VoiceTimelineJumpToDateItem.bind('itemClicked', this._jumpToHandlerRef);

            CV.VoiceAboutBox.bind('activate', function() {
                this._layers[0].waterfall.layout();
                this._layers[0]._updatePostIndicatorsPostion();
            }.bind(this));

            CV.VoiceAboutBox.bind('deactivate', function() {
                this._layers[0].waterfall.layout();
                this._layers[0]._updatePostIndicatorsPostion();

                localStorage['cvby__voice' + this.id + '__about-read'] = true;
            }.bind(this));

            return this;
        },

        /* Implementation of the data request.
         * All implementations should include this method.
         * @method request <private, abstract> [Function]
         */
        request : function request() {
            throw new Error('VoicePostLayers.prototype.request not implemented');
        },

        /* Implementation to request data event listeners.
         * All implementations should include this method.
         * @method __bindEvents <private, abstract> [Function]
         */
        __bindEvents : function __bindEvents() {
            throw new Error('VoicePostLayers.prototype.__bindEvents not implemented');
        },

        /* Implementation of __destroy method per implementation.
         * All implementations should include this method.
         * @method __destroy <private, abstract> [Function]
         */
        __destroy : function __destroy() {
            throw new Error('VoicePostLayers.prototype.__destroy not implemented');
        },

        /* Updates variables that are dependant to window size and update all layers.
         * @method update <public> [Function]
         * @return this;
         */
        update : function update() {
            this._setGlobarVars()._updateLayers();
            return this;
        },

        loadDefaultLayer : function loadDefaultLayer() {
            this._beforeRequest(this._layers[0].dateString);
            return this;
        },

        /* Jump to layer handler
         * @method _jumpToHandler <private> [Function]
         */
        _jumpToHandler : function _jumpToHandler(data) {
            var layer = this['postsLayer_' + data.dateString];
            var _this = this;

            if (!layer) return;
            if (layer === this.getCurrentMonthLayer()) return;

            // this._listenScrollEvent = false;

            this._layers.forEach(function(l) {
                if (l.getPosts().length) l.empty();
            });

            Velocity(layer.el, 'scroll', {
                duration : 600,
                complete : function() {
                    // _this._listenScrollEvent = true;
                }
            });
        },

        /* Cache variables values that depend on window’s size. This method is called on the init method and on the window.resize event.
         * @method _setGlobarVars <private>
         * @return undefined
         */
        _setGlobarVars : function _setGlobarVars() {
            this._windowInnerHeight = this._window.innerHeight;
            this._windowInnerWidth = this._window.innerWidth;
            this._availableWidth = this.el.clientWidth;
            this._updateAverageLayerHeight();
            return this;
        },

        /* Sets the value to the _averageLayerHeight property.
         * @method _updateAverageLayerHeight <private>
         * @return undefined
         */
        _updateAverageLayerHeight : function _updateAverageLayerHeight() {
            this._averageLayerHeight = ~~(this.averagePostTotal * this.averagePostHeight / ~~(this._availableWidth / this.averagePostWidth));
        },

        /* Creates all the required (empty) layers per month based on the
         * `firstPostDate` and `lastPostDate` properties.
         * @method _createEmptyLayers <private>
         * @return undefined
         */
        _createEmptyLayers : function _createEmptyLayers() {
            var frag = document.createDocumentFragment();

            this.postsCount.forEach(function(yearItem) {
                var year = yearItem.year;

                yearItem.months.forEach(function(monthItem, index) {
                    var dateString = moment(year + '-' + monthItem.month + '-01', 'YYYY-MM-DD').format('YYYY-MM');
                    var layer = new CV.VoicePostsLayer({
                        id : index,
                        name : 'postsLayer_' + dateString,
                        dateString : dateString,
                        columnWidth : this.averagePostWidth
                    });

                    layer.setHeight(this.getAverageLayerHeight());

                    this._layers.push(layer);
                    this.appendChild(layer);
                    frag.appendChild(layer.el);

                    dateString = layer = null;
                }, this);

                year = null;
            }, this);

            this.el.appendChild(frag);

            this._layers[0].el.classList.add('first');
            this._layers[this._layers.length - 1].el.classList.add('last');

            frag = null;
        },

        _updateLayers : function _updateLayers() {
            this._layers.forEach(function(layer) {
                layer.reLayout({
                    averageHeight: this.getAverageLayerHeight()
                });
            }, this);
        },

        _appendVoiceAboutBox : function _appendVoiceAboutBox(layer) {
            var voiceAboutBox = new CV.VoiceAboutBox({
                name : 'voiceAboutBox',
                description : this.description
            });

            layer.waterfall.addItems([voiceAboutBox.el]);
            layer.appendChild(voiceAboutBox).render(layer.postContainerElement);

            if (!localStorage['cvby__voice' + this.id + '__about-read']) {
                voiceAboutBox.activate();
            }

            voiceAboutBox = null;
        },

        /* Determines if we need to request the posts for the passed date.
         * If so, it will ask the socket to retrive the posts for a specific year-month.
         * @method _beforeRequest <private> [Function]
         */
        _beforeRequest : function _beforeRequest(dateString, scrollDirection) {
            if (dateString == this._currentMonthString) return false;

            this._currentMonthString = dateString;

            // prevent to append childs if the layer is already filled
            if (this['postsLayer_' + dateString].getPosts().length > 1) return false;

            // load from cache
            if (typeof this._cachedData[dateString] !== 'undefined') {
                return this.loadLayer(this._cachedData[dateString], dateString, scrollDirection);
            }

            // request to the server
            this.request(this.id, dateString, scrollDirection);
        },

        /* Fills a specific layer with childs (posts).
         * Stores the server response.
         * @param postsData <required> [Objects Array] the raw data of Post Models retrived from the server. We us this data to crate Post Widgets.
         * @dateString <required> [String] the data's month-year we received
         * @scrollDirection <optional> [Boolean] {false} false for downwards  1 for upwards
         * @return undefined
         */
        loadLayer : function loadLayer(postsData, dateString, scrollDirection) {
            var currentLayer = this.getCurrentMonthLayer();
            var prev = currentLayer.getPreviousSibling();
            var next = currentLayer.getNextSibling();
            var calcHeightDiff = false;

            if (typeof this._cachedData[dateString] === 'undefined') {
                this._cachedData[dateString] = postsData;
            }

            if (!currentLayer.isFinalHeightKnow()) {
                calcHeightDiff = true;
            }

            if (currentLayer.id === 0) {
                this._appendVoiceAboutBox(currentLayer);
            }

            currentLayer.addPosts(postsData);

            if (this._isInitialLoad) {
                this._isInitialLoad = false;
                this.loadImagesVisibleOnViewport();
                this.dispatch('ready', {layer: currentLayer});
            }

            this.dispatch('layerLoaded', {dateString: dateString});

            currentLayer.arrangeReset();

            if (prev) prev.arrangeBringToFront();

            if (scrollDirection) {
                var next2 = next && next.getNextSibling();

                if (next2) next2.empty().arrangeReset();

                if (calcHeightDiff) {
                    // compensate the heigth difference when scrolling up
                    var diff = currentLayer.getHeight() - this.getAverageLayerHeight();
                    var y = this.scrollableArea + diff;

                    this.scrollableArea.scrollTo(0, y);
                }

                return;
            }

            var prev2 = prev && prev.getPreviousSibling();

            if (prev2) prev2.empty().arrangeReset();
        },

        getCurrentMonthLayer : function getCurrentMonthLayer() {
            return this['postsLayer_' + this._currentMonthString];
        },

        /* Returns the value hold by the `_averageLayerHeight` property.
         * @method getAverageLayerHeight <public>
         * @return this._averageLayerHeight
         */
        getAverageLayerHeight : function getAverageLayerHeight() {
            return this._averageLayerHeight;
        },

        isScrolledIntoView : function isScrolledIntoView(el) {
            var r = el.getBoundingClientRect();

            return ((r.top < this._windowInnerHeight) && (r.bottom >= 0));
        },

        loadImagesVisibleOnViewport : function loadImagesVisibleOnViewport() {
            this._lazyLoadingImageArray.forEach(function(image) {
                image.abortImage();
            });

            this._lazyLoadingImageArray = [];

            this.getCurrentMonthLayer().getPosts().forEach(function(post) {
                if (post.imageLoaded === false) {
                    if (this.isScrolledIntoView(post.el)) {
                        this._lazyLoadingImageArray.push( post.loadImage() );
                    }
                }
            }, this);
        },

        destroy : function destroy() {
            Widget.prototype.destroy.call(this);
            this.__destroy();

            CV.VoiceTimelineJumpToDateItem.unbind('itemClicked', this._jumpToHandlerRef);
            this._jumpToHandlerRef = null;

            this.description = null;
            this.postsCount = null;
            this.firstPostDate = null;
            this.lastPostDate = null;
            this.averagePostTotal = null;
            this.averagePostWidth = null;
            this.averagePostHeight = null;
            this.scrollableArea = null;

            this.el = null;
            this._window = null;
            this._socket = null;
            this._layers = null;
            this._cachedData = null;
            this._currentMonthString = null;
            this._availableWidth = null;
            this._windowInnerHeight = null;
            this._windowInnerWidth = null;
            this._averageLayerHeight = null;
            this._isInitialLoad = null;
            this._lazyLoadingImageArray = null;

            return null;
        }
    }
});
