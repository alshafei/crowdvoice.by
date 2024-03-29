/* Module CV.VoiceModeratePagesRegistry
 * Object that holds all posts data of a voice as we requests them.
 * By defautl the registry is empty, we need to tell it which pages keys it
 * should create for later set/get its data.
 */
Module(CV, 'VoiceModeratePagesRegistry')({
  _: {},

  /* Registers the empty pages keys.
   * @public
   * @param {Array} pages The pages numbers [0,1,2...]
   */
  setup: function setup(pages) {
    pages.forEach(function (page) {
      this._[page] = null;
    }, this);
  },

  /* Returns the posts data of a specific page in case `page` param is passed,
   * otherwise it returns the whole registry data.
   * @public
   * @param {string|number[]} page
   * @return {Array|Object} the page’s posts data or the whole registry data.
   */
  get: function get(page) {
    if (typeof page !== 'undefined') return this._[page];
    return this._;
  },

  /* Sets the posts data to the passed page key.
   * @param {string|number} page
   * @param {Array} the posts data
   */
  set: function set(page, posts) {
    this._[page] = posts;
  }
});
