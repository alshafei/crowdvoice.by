Class(CV.UI, 'Button').inherits(Widget).includes(CV.WidgetUtils)({
    ELEMENT_CLASS : 'cv-button',
    HTML : '<button></button>',
    prototype : {
        data : {
            value : ''
        },

        init : function init(config) {
            Widget.prototype.init.call(this, config);
            this.el = this.element[0];
            console.log(this.data);
            this.dom.updateText(this.el, this.data.value);
        },

        _enable : function _enable() {
            Widget.prototype._enable.call(this);
            this.dom.updateAttr('disabled', this.el, false);
        },

        _disable : function _disable() {
            Widget.prototype._disable.call(this);
            this.dom.updateAttr('disabled', this.el, true);
        }
    }
});