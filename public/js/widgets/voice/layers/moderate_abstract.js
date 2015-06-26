
/* Subclass of VoicePostLayers
 * Declares the required abstract methods to handle the Voice Posts on Moderation Mode
 */
Class(CV, 'VoicePostLayersModerateAbstract').inherits(CV.VoicePostLayers)({

    prototype : {

        /* Implementation to request post data to the server.
         * @method request <protected, abstract> [Function]
         */
        request : function request(id, dateString, scrollDirection) {
            this._socket.emit('getMonthPostsModerate', id, dateString, scrollDirection);
        },

        /* Implementation to add and render post to a layer.
         * @method addPosts <public, abstract> [Function]
         */
        addPosts : function addPosts(layer, postsData) {
            var layers = this;

            layer.addEditablePosts(postsData).getPosts().forEach(function(post) {
                // Voice Owner / Org Member / Contributor
                if (layers.allowPostEditing) {
                    post.edit().addRemoveButton().addPublishButton();
                    post.bind('dimensionsChanged', layers._reLayoutLayer);
                    return;
                }

                // Visitor (posts list)
                post.unmoderatedStyle().addVoteButtons();
            });

            layer.reLayout();

            return this;
        },

        /* Implementation to remove/destroy posts from a layer.
         * @method removePosts <public, abstract> [Function]
         */
        removePosts : function removePosts(layer) {
            var layers = this;

            if (layers.allowPostEditing) {
                layer.getPosts().forEach(function(post) {
                    post.unbind('dimensionsChanged', layers._reLayoutLayer);
                });
            }

            layer.empty();

            return this;
        },

        /* dimensionsChanged custom event handler. Updates the posts position when
         * its dimentions has been changed. e.i. on edit mode » change the
         * description/title length
         * @method _reLayoutLayer <private> [Function]
         */
        _reLayoutLayer : function _reLayoutLayer(data) {
            data.layer.reLayout();
        },

        /* Implementation for custom bindings required by this subclass.
         * @method __bindEvents <protected, abstract> [Function]
         */
        __bindEvents : function __bindEvents() {
            this._socket.on('monthPostsModerate', this._loadLayerRef);
            return this;
        },

        /* Implementation to remove custom bindings required by this subclass.
         * @method __destroy <protected, abstract> [Function]
         */
        __destroy : function __destroy() {
            this._socket.removeListener('monthPostsModerate', this._loadLayerRef);
        }
    }
});
