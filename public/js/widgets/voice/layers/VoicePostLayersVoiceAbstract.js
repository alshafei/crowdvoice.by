/* globals App */
/* Subclass of VoicePostLayers
 * Declares the required abstract methods to handle the Voice Posts on Normal Mode
 */
Class(CV, 'VoicePostLayersVoiceAbstract').inherits(CV.VoicePostLayers)({
    prototype : {
        setup : function setup() {
            CV.VoicePostLayers.prototype.setup.call(this);
            CV.PostsRegistry.setup(this.postsCount);

            return this;
        },

        getPostsRegistry : function getPostsRegistry(date) {
            return CV.PostsRegistry.get(date);
        },

        setPostsRegistry : function setPostsRegistry(date, posts) {
            CV.PostsRegistry.set(date, posts);
        },

        /* Implementation to request post data to the server.
         * @method request <protected, abstract> [Function]
         */
        request : function request(id, dateString, scrollDirection) {
            this._socket.emit('getApprovedMonthPosts', id, dateString, scrollDirection);
        },

        /* Implementation to add and render post to a layer.
         * @method addPosts <public, abstract> [Function]
         */
        addPosts : function addPosts(layer, postsData) {
            layer.addPosts(postsData);
            layer.filterPosts(App.Voice.voiceFooter.filterDropdown.getSelectedSourceTypes());
        },

        /* Implementation to remove/destroy posts from a layer.
         * @method removePosts <public, abstract> [Function]
         */
        removePosts : function removePosts(layer) {
            layer.empty();
            return this;
        },

        /* Gets the scroll height of the scrollable area.
         * @method getScrollHeight <protected> [Function]
         */
        getScrollHeight : function getScrollHeight() {
            return document.body.clientHeight;
        },

        /* Gets the scroll top of the scrollable area.
         * @method getScrollTop <protected> [Function]
         */
        getScrollTop : function getScrollTop() {
            return this.scrollableArea.scrollY;
        },

        /* Scroll to a y position of the scrollable area.
         * @method getScrollTo <protected> [Function]
         */
        scrollTo : function scrollTo(y) {
            this.scrollableArea.scrollY = y;
        },

        /* Implementation for custom bindings required by this subclass.
         * @method __bindEvents <protected, abstract> [Function]
         */
        __bindEvents : function __bindEvents() {
            this._socket.on('approvedMonthPosts', this._loadLayerRef);
            return this;
        },

        /* Implementation to remove custom bindings required by this subclass.
         * @method __destroy <protected, abstract> [Function]
         */
        __destroy : function __destroy() {
            this._socket.removeListener('approvedMonthPosts', this._loadLayerRef);
        }
    }
});