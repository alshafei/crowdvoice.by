/* Collection of available endpoints we are allowed to use to communicate with the server.
 */
module.exports = {
    /* Holds the page token, used for the server to accept our requests.
     * @property token <private>
     */
    token : $('meta[name="csrf-token"]').attr('content'),

    /**************************************************************************
     * VOICES
     *************************************************************************/
    /* Creates a new Voice.
     * @argument args.data <required> [Object]
     * @argument callback <required> [Function]
     */
    voiceCreate : function voiceCreate(args, callback) {
        if (!args.data || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/voice',
            headers : {'csrf-token' : this.token},
            cache : false,
            contentType : false,
            processData : false,
            data : args.data,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Updates an existing Voice.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.data <required> [Object]
     * @argument callback <required> [Function]
     */
    voiceEdit : function voiceEdit(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.data || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'PUT',
            url : '/' + args.profileName + '/' + args.voiceSlug,
            headers : {'csrf-token' : this.token},
            cache : false,
            contentType : false,
            processData : false,
            data : args.data,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Archives an existing Voice.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument callback <required> [Function]
     */
     voiceArchive : function voiceArchive (args, callback) {
        if (!args.profileName || !args.voiceSlug || !callback){
            throw new Error('Missing required params');
        }
        if ((typeof callback).toLowerCase() !== "function"){
            throw new Error ('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/' + args.profileName + '/' + args.voiceSlug +'/archive?_method=PUT',
            headers : {'csrf-token' : this.token},
            cache : false,
            data : {},
            contentType : 'json',
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
     },

    /* Follow/Unfollow Voice.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.data.followerId <required> [String] Hashids.encode
     * @argument callback <required> [Function]
     */
    followVoice : function followVoice(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.data.followerId || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/follow',
            data : args.data,
            dataType : 'json',
            headers : {'csrf-token' : this.token},
            success : function success(data) {callback(false, data);},
            error : function error(err) {callback(true, err);}
        });
    },

    /* Requests the data to create a Post preview on the current Voice.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.url <required> [String] absolute url of a page, image or video (youtube/vimeo)
     * @argument callback <required> [Function]
     */
    postPreview : function postPreview(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.url || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/preview',
            headers : {'csrf-token' : this.token},
            data : {url : args.url},
            success: function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Request to contribute to a voice.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.data.message <required> [Text] the message to send to the organizaiton
     * @argument callback <required> [Function]
     */
    voiceRequestToContribute : function voiceRequestToContribute(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.data.message || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            method : 'POST',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/requestToContribute',
            headers : {'csrf-token' : this.token},
            data : args.data,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Adds a voice as related to other voice.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.data.relatedVoiceId <required> [String] the id of the voice to add
     * @argument callback <required> [Function]
     */
    voiceAddRelatedVoice : function voiceAddRelatedVoice(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.data.relatedVoiceId || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            method : 'POST',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/manageRelatedVoices',
            headers : {'csrf-token': this.token},
            data : args.data,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Removes relationship between one voice and other voice.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.data.relatedVoiceId <required> [String] the id of the voice to add
     * @argument callback <required> [Function]
     */
    voiceRemoveRelatedVoice : function voiceRemoveRelatedVoice(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.data.relatedVoiceId || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            method : 'POST',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/manageRelatedVoices?_method=DELETE',
            headers : {'csrf-token': this.token},
            data : args.data,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
     },

     /* Saves new article to voice.
     * @argument args.userSlug <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.articleTitle <required> [String] the article title
     * @argument args.articleContent <required> [String] article html content
     * @argument callback <required> [Function]
     */
     voiceNewArticle : function voiceNewArticle(args, callback) {
        if (!args.userSlug || !args.voiceSlug || !args.articleTitle || !args.articleContent || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        var postData = {
          title: args.articleTitle,
          content: args.articleContent,
          publishedAt: args.articleDate,
          imagePath : args.articleImage
        };

        $.ajax({
            type : 'POST',
            url : '/' + args.userSlug + '/' + args.voiceSlug +'/saveArticle',
            headers : {'csrf-token' : this.token},
            cache : false,
            data : postData,
            dataType : 'json',
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); },
        });
    },
    /* Invite user to become contributor of voice.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.data.personId <required> [String] ID of new contributor
     * @argument args.data.message <required> [Text] text message to send to contributor
     * @argument callback <required> [Function]
     */
     voiceInviteToContribute : function voiceInviteToContribute(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.data.personId || !args.data.message || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            method : 'POST',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/inviteToContribute',
            headers : {'csrf-token': this.token},
            data : args.data,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
     },

    /* Removes contributor from voice.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.data.personId <required> [String] ID of contributor to remove
     * @argument callback <required> [Function]
     */
     voiceRemoveContributor : function voiceRemoveContributor(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.data.personId || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            method : 'POST',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/removeContributor',
            headers : {'csrf-token': this.token},
            data : args.data,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
     },

    /**************************************************************************
     * POSTS
     *************************************************************************/
    /* Upload a photo to be added into a specific voice.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.data <required> [FormData] the image as FormData
     * @argument callback <required> [Function]
     */
    uploadPostImage : function uploadPostImage(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.data || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/upload',
            headers : {'csrf-token' : this.token},
            data : args.data,
            cache : false,
            contentType : false,
            processData : false,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Upload a photo to be added into a specific article.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.data <required> [FormData] the image as FormData
     * @argument callback <required> [Function]
     */
    uploadArticleImage : function uploadArticleImage(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.data || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/uploadPostImage',
            headers : {'csrf-token' : this.token},
            data : args.data,
            cache : false,
            contentType : false,
            processData : false,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Creates a Post on the current Voice.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.posts <required> [Array] each post data
     * @argument callback <required> [Function]
     */
    postCreate : function postCreate(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.posts || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            dataType : 'json',
            url : '/' + args.profileName + '/' + args.voiceSlug,
            headers : {'csrf-token' : this.token},
            data : {posts: args.posts},
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Updates a Post.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.postId <required> [String] the post id to up/down vote
     * @argument args.data <required> [Object] the post data
     * @argument callback <required> [Function]
     */
    postUpdate : function postUpdate(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.postId || !args.data || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'PUT',
            dataType : 'json',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/' + args.postId,
            headers : {'csrf-token' : this.token},
            data : args.data,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Deletes a Post.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.postId <required> [String] the post id to up/down vote
     * @argument args.data <required> [Object] the post data
     * @argument callback <required> [Function]
     */
    postDelete : function postDelete(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.postId || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/' + args.postId + '?_method=DELETE',
            headers : {'csrf-token' : this.token},
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Allows a post to be voted up or down.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.postId <required> [String] the post id to up/down vote
     * @argument args.vote <required> [String] ("up" | "down") upvote or downvote
     */
    postVote : function postVote(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.postId || !args.vote || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'GET',
            dataType : 'json',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/' + args.postId + '/vote/' + args.vote,
            headers : {'csrf-token' : this.token},
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Saves a post (favotite).
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.postId <required> [String] the post id to up/down vote
     */
    postSave : function postSave(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.postId || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            dataType : 'json',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/' + args.postId + '/savePost',
            headers : {'csrf-token' : this.token},
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Unsaves a post (un-favotite).
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.postId <required> [String] the post id to up/down vote
     */
    postUnsave : function postUnsave(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.postId || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            dataType : 'json',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/' + args.postId + '/unsavePost',
            headers : {'csrf-token' : this.token},
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Deletes all posts that have not yet been moderated,
     * i.e. a approved = false in the DB, older than the provided Date string,
     * i.e. created_at < provided date in the DB.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.olderThanDate <required> [Date String]
     */
    deletePostsOlderThan : function deletePostsOlderThan(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.data.olderThanDate || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            method : 'POST',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/moderate/deleteOlderThan?_method=DELETE',
            headers : {'csrf-token': this.token},
            data : args.data,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Deletes all posts that have not yet been moderated, i.e. a approved = false in the DB.
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     */
    deleteAllUnmoderatedPosts : function deleteAllUnmoderatedPosts(args, callback) {
        if (!args.profileName || !args.voiceSlug || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            method : 'POST',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/moderate/deleteAllUnmoderated?_method=DELETE',
            headers : {'csrf-token': this.token},
            data : args.data,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Search for Posts in Sources
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument args.voiceSlug <required> [String] the voice slug
     * @argument args.source <required> [String] the source to search on ['googleNews', 'youtube']
     * @argument args.query <required> [String] the query string
     * @argument callback <required> [Function]
     */
    searchPostsInSource : function searchPostsInSource(args, callback) {
        if (!args.profileName || !args.voiceSlug || !args.source || !args.query|| !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'GET',
            dataType : 'json',
            url : '/' + args.profileName + '/' + args.voiceSlug + '/' + args.source + '/' + encodeURIComponent(args.query),
            headers : {'csrf-token' : this.token},
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /**************************************************************************
     * ENTITIES
     *************************************************************************/
    /* Save Entity data.
     * @argument args.profileName <required> [String] the entity profileName
     * @argument args.data.image <optional> [File] entity's image
     * @argument args.data.background <optional> [File] entity's background
     * @argument args.data.name <optional> [String] entity's name
     * @argument args.data.lastname <optional> [String] entity's lastname
     * @argument args.data.profileName <optional> [String] entity's profileName
     * @argument args.data.description <optional> [String] entity's description
     * @argument args.data.location <optional> [String] entity's location
     * @argument callback <required> [Function]
     */
    updateEntity : function updateEntity(args, callback) {
        if (!args.profileName || !args.data || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }
        // debugger;
        $.ajax({
            type : 'PUT',
            url : '/' + args.profileName,
            headers : {'csrf-token' : this.token},
            contentType : false,
            processData : false,
            dataType : 'json',
            data : args.data,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Save User data.
     * @argument args.profileName <required> [String] the entity profileName
     * @argument args.data.email <optional> [String] entity's email
     * @argument args.data.password <optional> [String] entity's password
     * @argument callback <required> [Function]
     */
    updateUser : function updateUser(args, callback) {
        if (!args.profileName || (!args.data.email && !args.data.password) || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        var data = {};
        if (args.data.email) {data.email = args.data.email;}
        if (args.data.password) {data.password = args.data.password;}

        $.ajax({
            type : 'PUT',
            url : '/' + args.profileName + '/updateUser',
            headers : {'csrf-token' : this.token},
            dataType : 'json',
            data : data,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Update notification settings.
     * @argument args.profileName <required> [String] the entity profileName
     * @argument args.data.webSettings <required> [String]
     * @argument args.data.emailSettings <required> [String]
     */
    updateNotificationSettings : function updateNotificationSettings(args, callback) {
        if (!args.profileName || (!args.data.webSettings && !args.data.emailSettings) || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'PUT',
            url : '/' + args.profileName + '/edit/updateNotificationSettings',
            dataType : 'json',
            contentType : 'application/json',
            data : JSON.stringify(args.data),
            headers : {'csrf-token' : this.token},
            success : function success(data) {callback(false, data);},
            error : function error(err) {callback(true, err);}
        });
    },

    /* Follow/Unfollow Entity
     * @argument args.profileName <required> [String] the entity profileName
     * @argument args.data.followerId <required> [String] Hashids.encode
     * @argument callback <required> [Function]
     */
    followEntity : function followEntity(args, callback) {
        if (!args.profileName || !args.data.followerId || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/' + args.profileName + '/follow',
            dataType : 'json',
            data : args.data,
            headers : {'csrf-token' : this.token},
            success : function success(data) {callback(false, data);},
            error : function error(err) {callback(true, err);}
        });
    },

    /* Gets :profileName's Published Voices
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument callback <required> [Function]
     */
    getEntityVoices : function getEntityVoices(args, callback) {
        if (!args.profileName || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : "GET",
            url :'/' + args.profileName + '/voices',
            headers : {'csrf-token' : this.token},
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Gets :profileName's followers
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument callback <required> [Function]
     */
    getEntityFollowers : function getEntityFollowers(args, callback) {
        if (!args.profileName || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : "GET",
            url :'/' + args.profileName + '/followers',
            headers : {'csrf-token' : this.token},
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Get published voices followed by :profileName
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument callback <required> [Function]
     */
    getEntityFollowedVoices : function getEntityFollowedVoices(args, callback) {
        if (!args.profileName || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : "GET",
            url :'/' + args.profileName + '/voicesFollowed',
            headers : {'csrf-token' : this.token},
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Get people and organizations followed by :profileName
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument callback <required> [Function]
     */
    getEntityFollowedEntities : function getEntityFollowedEntities(args, callback) {
        if (!args.profileName || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : "GET",
            url :'/' + args.profileName + '/entitiesFollowed',
            headers : {'csrf-token' : this.token},
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Checks if a voiceSlug exists
     * @argument args.profileName <required> [String] the entity profileName
     * @argument args.value <required> [String]
     * @argument callback <required> [Function]
     */
    isSlugAvailable : function isSlugAvailable(args, callback) {
        if (!args.profileName || !args.slug || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        var url = '/' + args.profileName + '/isVoiceSlugAvailable';

        if (args.voiceSlug) {
          url = '/' + args.profileName + '/' + args.voiceSlug + '/isVoiceSlugAvailable';
        }

        $.ajax({
            type : 'POST',
            url : url,
            data : {value: args.slug},
            dataType : 'json',
            headers : {'csrf-token' : this.token},
            success : function success(data) {callback(false, data);},
            error : function error(err) {callback(true, err);}
        });
    },

    /* Checks if a profileName is available
     * @argument args.profileName <required> [String] the entity profileName
     * @argument args.value <required> [String]
     * @argument callback <required> [Function]
     */
    isProfileNameAvailable : function isProfileNameAvailable(args, callback) {
        if (!args.profileName || !args.value || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            method : 'POST',
            url : '/' + args.profileName + '/isProfileNameAvailable',
            headers : {'csrf-token' : this.token},
            data : {value: args.value},
            success : function success(data) {callback(false, data);},
            error : function error(err) {callback(true, err);}
        });
    },

    /**************************************************************************
     * ORGANIZATIONS
     *************************************************************************/
    /* Get people and organizations followed by :profileName
     * @argument args.profileName <required> [String] the voice owner profileName
     * @argument callback <required> [Function]
     */
    getOrganizationMembers : function getOrganizationMembers(args, callback) {
        if (!args.profileName || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : "GET",
            url :'/' + args.profileName + '/members',
            headers : {'csrf-token' : this.token},
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Creates a new Organization.
     * @argument args.data <required> [Object] organization data
     * @argument callback <required> [Function]
     */
    createOrganization : function createOrganization(args, callback) {
        if (!args.data || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/' + args.profileName + '/newOrganization',
            headers : {'csrf-token' : this.token},
            cache : false,
            contentType : false,
            processData : false,
            data : args.data,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Remove entity from organization. Must be part of organization in order to do so.
     * @argument args.profileName <required> [String] profileName of current user.
     * @argument args.data.entityId <required> [hashid] entity ID of current user.
     * @argument args.data.orgId <required> [hashid] entity ID of organization to be removed from.
     * @argument callback <required> [Function]
     */
    leaveOrganization : function leaveOrganization(args, callback) {
        if (!args.profileName || !args.data || !args.data.entityId || !args.data.orgId || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type: "POST",
            url : '/' + args.profileName + '/leaveOrganization',
            headers : {'csrf-token' : this.token},
            data : {
                entityId : args.data.entityId,
                orgId : args.data.orgId
            },
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /* Request invitation for membership of organization.
     * @argument args.profileName <required> [String] profileName of organization
     * @argument args.data.orgId <required> [hashid] entity ID of organization tp request membership of
     * @argument args.data.message <required> [Text] the message to send to the organizaiton
     * @argument callback <required> [Function]
     */
    requestMembership : function requestMembership(args, callback) {
        if (!args.profileName || !args.data.orgId || !args.data.message || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/' + args.profileName + '/requestMembership',
            headers : {'csrf-token' : this.token},
            data : args.data,
            success : function success(data) { callback(false, data); },
            error : function error(err) { callback(true, err); }
        });
    },

    /**************************************************************************
     * THREATS
     *************************************************************************/
    /* Creates a thread or insert a message in an existing thread.
     * @argument args.profileName <required> [String] currentPerson profileName
     * @argument args.type <required> [String] Message type ('message')
     * @argument args.senderEntityId [String] currentPerson hashid
     * @argument args.receiverEntityId [String] receriver Person hashid
     * @argument args.message <required> [String] the text message
     * @argument callback <required> [Function]
     */
    sendMessage : function sendMessage(args, callback) {
        if (!args.profileName || !args.type || !args.senderEntityId || !args.receiverEntityId || !args.message || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/' + args.profileName + '/messages',
            headers : {'csrf-token' : this.token},
            data : {
                type : args.type,
                senderEntityId : args.senderEntityId,
                receiverEntityId : args.receiverEntityId,
                message : args.message
            },
            success : function success(data) {callback(false, data);},
            error : function error(err) {callback(true, err);}
        });
     },

     /* Answer to an invitation.
      * @argument args.profileName <required> [String] currentPerson profileName
      * @argument args.threadId <required> [String]
      * @argument args.messageId <required> [String]
      * @argument args.data.action <required> ('accepted', 'ignore')
      * @argument args.data.anonymous <optional>
      * @argument callback <required> [Function]
      */
    threatAnswerInvitation : function threatAnswerInvitation(args, callback) {
        if (!args.profileName || !args.threadId || !args.messageId || !args.data.action || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/' + args.profileName + '/messages/' + args.threadId + '/' + args.messageId  +'/answerInvite',
            headers : {'csrf-token' : this.token},
            dataType : 'json',
            data : args.data,
            success : function success(data) {callback(false, data);},
            error : function error(err) {callback(true, err);}
        });
    },

    /* Invite user to become part of organization or contributor of voice.
     * @argument args.profileName <required> [String] currentPerson profileName
     * @argument args.data.type <required> [String] Message type ['invitation_voice', 'invitation_organization']
     * @argument args.data.receiverEntityId [String] receriver Person hashid
     * @argument args.data.voiceId | args.data.organizationId [String]
     * @argument args.data.message <required> [String] the text message
     * @argument callback <required> [Function]
     */
    sendInvitation : function sendInvitation(args, callback) {
        if (!args.profileName || !args.data.type || (!args.data.voiceId && !args.data.organizationId) || !args.data.receiverEntityId || !args.data.message || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/' + args.profileName + '/messages',
            headers : {'csrf-token' : this.token},
            data : args.data,
            success : function success(data) {callback(false, data);},
            error : function error(err) {callback(true, err);}
        });
     },

    /**************************************************************************
     * SEARCH
     *************************************************************************/
    /* Get Voices, People and Organizations results from a specified query.
     * @argument args.query <required> [String] the query string
     * @argument callback <required> [Function]
     */
    search : function search(args, callback) {
        if (!args.query || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'GET',
            url : '/search/' + args.query,
            dataType : 'json',
            headers : {'csrf-token' : this.token},
            success : function success(data) {callback(false, data);},
            error : function error(err) {callback(true, err);}
        });
    },

    /* Get Voices results from a specified query.
     * @argument args.query <required> [String] the query string.
     * @argument args.exclude <optional> [Array] Array of voices ids to exclude from the results.
     * @argument callback <required> [Function]
     */
    searchVoices : function searchVoices(args, callback) {
        if (!args.query || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/search/voices',
            headers : {'csrf-token' : this.token},
            dataType : 'json',
            data : {
                query : args.query,
                exclude : args.exclude || []
            },
            success : function success(data) {callback(false, data);},
            error : function error(err) {callback(true, err);}
        });
    },

    /* Get People results from a specified query
     * @argument args.query <required> [String] the query string.
     * @argument args.exclude <optional> [Array] Array of people hashids to exclude from the results.
     * @argument callback <required> [Function]
     */
    searchPeople : function searchPeople(args, callback) {
        if (!args.query || !callback) {
            throw new Error('Missing required params');
        }

        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'POST',
            url : '/search/people',
            headers : {'csrf-token' : this.token},
            dataType : 'json',
            data : {
                query : args.query,
                exclude : args.exclude || []
            },
            success : function success(data) {callback(false, data);},
            error : function error(err) {callback(true, err);}
        });
    },

    /**************************************************************************
     * DISCOVER
     *************************************************************************/
    /* Return the voices with the most followers.
     * @argument callback <required> [Function]
     */
    getTrendingVoices : function getTrendingVoices(callback) {
        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'GET',
            url : '/discover/trending/voices',
            headers : {'csrf-token' : this.token},
            dataType : 'json',
            success : function success(data) {callback(false, data);},
            error : function error(err) {callback(true, err);}
        });
    },

    /**************************************************************************
     * MISC
     *************************************************************************/
    /* Returns the registered topics. [Array]
     * @argument callback <required> [Function]
     */
    getTopics : function getTopics(callback) {
        if ((typeof callback).toLowerCase() !== "function") {
            throw new Error('Callback should be a function');
        }

        $.ajax({
            type : 'GET',
            url : '/topics',
            headers : {'csrf-token' : this.token},
            success : function success(data) {callback(false, data);},
            error : function error(err) {callback(true, err);}
        });
    }
};
