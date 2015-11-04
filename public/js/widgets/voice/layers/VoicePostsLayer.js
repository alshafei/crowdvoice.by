var moment = require('moment');
var Waterfall = require('../../../lib/waterfall');

Class(CV, 'VoicePostsLayer').inherits(Widget).includes(BubblingSupport)({
    HTML : '\
        <div class="cv-voice-posts-layer">\
            <div class="cv-voice-posts-layer__detector"></div>\
            <div class="cv-voice-posts-layer__posts"></div>\
            <div class="cv-voice-posts-layer__ticks">\
                <div class="cv-voice-post-layer__tick-month"></div>\
            </div>\
        </div>',

    prototype : {
        /* OPTIONS */
        dateString : '',
        columnWidth : 350,
        allowPostEditing : false,

        /* PRIVATE PROPERTIES */
        _finalHeightIsKnow : false,

        _postWidgets : null,
        _indicatorWidgets : null,

        postContainerElement : null,
        ticksContainerElement : null,
        waterfall : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.el = this.element[0];
            this.postContainerElement = this.el.querySelector('.cv-voice-posts-layer__posts');
            this.ticksContainerElement = this.el.querySelector('.cv-voice-posts-layer__ticks');

            this._postWidgets = [];
            this._indicatorWidgets = [];

            this.el.querySelector('.cv-voice-post-layer__tick-month').textContent = moment(this.dateString).format('MMM ’YY');
            this.el.querySelector('.cv-voice-posts-layer__detector').dataset.date = this.dateString;
            this.el.dataset.date = this.dateString;

            this.addLoaders();

            this.waterfall = new Waterfall({
                containerElement : this.postContainerElement,
                columnWidth : this.columnWidth,
                gutter : 20
            });
        },

        addLoaders : function addLoaders() {
            if (this.loadingTop) {
                this.loadingTop.enable();
            } else {
                this.appendChild(new CV.Loading({
                    name : 'loadingTop'
                })).center().setStyle({
                    top: '150px',
                    zIndex: 1
                }).render(this.el);
            }

            if (this.loadingMiddle) {
                this.loadingMiddle.enable();
            } else {
                this.appendChild(new CV.Loading({
                    name : 'loadingMiddle'
                })).center().setStyle({
                    zIndex: 1
                }).render(this.el);
            }

            if (this.loadingBottom) {
                this.loadingBottom.enable();
            } else {
                this.appendChild(new CV.Loading({
                    name : 'loadingBottom'
                })).center().setStyle({
                    top: 'initial',
                    bottom: '150px',
                    zIndex: 1
                }).render(this.el);
            }

            return this;
        },

        hideLoaders : function hideLoaders() {
            this.loadingTop.disable();
            this.loadingMiddle.disable();
            this.loadingBottom.disable();
            return this;
        },

        /* Updates the layer's height, relayout posts and update indicators. Should be called when the window dimensions are changed.
         * @method reLayout <public> [Function]
         * @return this
         */
        reLayout : function reLayout(args) {
            if (this.waterfall.getItems().length) {
                this.waterfall.layout();
                this._updatePostIndicatorsPostion();
            }

            if (!this.getPosts().length) {
                this.setHeight(args.averageHeigth);
            }

            return this;
        },

        /* Sets the heigth of the layer. If a number is provided it will convert it into pixel units.
         * @method setHeight <public> [Function]
         * @param height <required> [Number or String]
         */
        setHeight : function setHeight(height) {
            if (typeof height === 'number') {
                height = height + 'px';
            }

            this.postContainerElement.style.height = height;
            this._finalHeightIsKnow = false;
        },

        /* Returns the total height of the postContainerElement.
         * @method getHeight <public> [Function]
         * @return [this.postContainerElement]
         */
        getHeight : function getHeight() {
            return this.postContainerElement.clientHeight;
        },

        /* Create, append and render its post children.
         * @method addPosts <public> [Function]
         * @param posts <required> [Objact Array] Post Model data to create a  new instance.
         * @return [VoicePostsLayer]
         */
        addPosts : function addPosts(posts) {
            this.addLoaders();

            var frag = document.createDocumentFragment();
            var i = 0;
            var len = posts.length;
            var post;

            for (i = 0; i < len; i++) {
                posts[i].name = 'post_' + i;

                post = CV.Post.create(posts[i]);
                post.addActions();
                post.el.dataset.date = moment(posts[i].publishedAt).format('YYYY-MM-DD');

                this.appendChild(post).render(frag);
                this._postWidgets.push(post);
            }

            this.waterfall.addItems([].slice.call(frag.childNodes, 0));
            this.postContainerElement.appendChild(frag);
            this.waterfall.layout();
            this._addPostIndicators(this._postWidgets);
            this.hideLoaders();

            this._finalHeightIsKnow = true;

            return this;
        },

        addEditablePosts : function addEditablePosts(posts) {
            this.addLoaders();

            var frag = document.createDocumentFragment();
            var i = 0;
            var len = posts.length;
            var post;

            for (i = 0; i < len; i++) {
                posts[i].name = 'post_' + i;
                post = CV.EditablePost.create(posts[i]);
                post.el.dataset.date = moment(posts[i].publishedAt).format('YYYY-MM-DD');

                this.appendChild(post).render(frag);
                this._postWidgets.push(post);
            }

            this.waterfall.addItems([].slice.call(frag.childNodes, 0));
            this.postContainerElement.appendChild(frag);
            this.waterfall.layout();
            this._addPostIndicators(this._postWidgets);
            this.hideLoaders();

            this._finalHeightIsKnow = true;

            return this;
        },

        /* Filter the displayed Posts by sourceType.
         * The available sourceTypes are: ['image', 'video', 'link']
         * @argument sourceTypes <optional> [Array] the sourceTypes to display.
         *  if omitted it will show all of them.
         */
        filterPosts : function filterPosts(sourceTypes) {
            var showAll = false;

            if (!sourceTypes) {
                showAll = true;
            }

            function showAllFn(post) {
                post.el.style.display = 'block';
            }

            function filterFn(post) {
                if (sourceTypes.indexOf(post.sourceType) < 0) {
                    post.el.style.display = 'none';
                } else {
                    post.el.style.display = 'block';
                }
            }

            if (showAll) {
                this._postWidgets.forEach(showAllFn);
            } else {
                this._postWidgets.forEach(filterFn);
            }

            this.waterfall.layout();
            this.parent.loadImagesVisibleOnViewport();
        },

        /* Returns its children Posts instances.
         * @method getPosts <public> [Function]
         * @return [this._postWidgets]
         */
        getPosts : function getPosts() {
            return this._postWidgets;
        },

        /* Returns its children PostIndicators instances.
         * @method getIndicators <oublic> [Function]
         * @return [this._indicatorWidgets]
         */
        getIndicators : function getIndicators() {
            return this._indicatorWidgets;
        },

        isFinalHeightKnow : function isFinalHeightKnow() {
            return this._finalHeightIsKnow;
        },

        arrangeBringToFront : function arrangeBringToFront() {
            this.el.style.zIndex = 1;
            return this;
        },

        arrangeReset : function arrangeReset() {
            this.el.style.zIndex = "";
            return this;
        },

        /* Destroy all its posts children.
         * @return undefined
         */
        empty : function empty() {
            while (this.children.length > 0) {
                this.children[0].destroy();
            }

            this.waterfall.flushItems();

            this._postWidgets = [];
            this._indicatorWidgets = [];

            return this;
        },

        /* Create, append and render the posts dates indicators shown on the
         * far right of the screen. Will also make sure to only display the
         * first indicator per date coincidence YYYY-MM-DD.
         * @private
         * This function is invoked by `addPosts` public method.
         * @param posts <required> [Object Array] Post instances references.
         * @return undefined
         */
        _addPostIndicators : function _addPostIndicators(posts) {
            var frag = document.createDocumentFragment();
            var i = 0;
            var len = posts.length;
            var indicator, firstDateCoincidence, currentDate;

            for (i = 0; i < len; i++) {
                currentDate = posts[i].el.dataset.date.match(/\d{4}-\d{2}-\d{2}/)[0];

                if (firstDateCoincidence !== currentDate) {
                    firstDateCoincidence = currentDate;

                    indicator = new CV.VoicePostIndicator({
                        name : 'indicator_' + i,
                        label : posts[i].el.dataset.date,
                        refElement : posts[i].el,
                        zIndex : len - i
                    });

                    indicator.activate();

                    this.appendChild(indicator).render(frag);
                    this._indicatorWidgets.push(indicator);
                }
            }

            // Avoid forced synchronous layout
            this._updatePostIndicatorsPostion();

            this.ticksContainerElement.appendChild(frag);

            frag = i = len = indicator = firstDateCoincidence = currentDate = null;
        },

        /* Updates the position of each indicator.
         * @private
         */
        _updatePostIndicatorsPostion : function _updatePostIndicatorsPostion() {
            var i = 0;
            var len = this._indicatorWidgets.length;

            CV.VoicePostIndicator.flushRegisteredYValues();

            for (i = 0; i < len; i++) {
                this._indicatorWidgets[i].updatePosition();
            }
        },

        removePost : function removePost(post) {
            post.destroy();
            this.removeChild(post);

            var index = this._postWidgets.indexOf(post);
            if (index > -1) {
                this._postWidgets.splice(index, 1);
            }

            // this.getIndicators().forEach(function(indicator) {
            //     this.removeChild(indicator);
            // }, this);
            // this.ticksContainerElement.innerHTML = '';
            // CV.VoicePostIndicator.flushRegisteredYValues();
            // this._addPostIndicators(this._postWidgets);

            if (this._postWidgets.length === 0) {
                return this.destroy();
            }

            this.reLayout();
        },

        destroy : function destroy() {
            Widget.prototype.destroy.call(this);

            this.waterfall.destroy();

            this.dateString = null;
            this.columnWidth = null;

            this._finalHeightIsKnow = false;
            this._postWidgets = null;

            this.waterfall = null;
        }
    }
});
