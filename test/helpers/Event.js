(function (root) {
    'use strict';

    var Helpers = (root.Helpers = root.Helpers || {});

    /**
     * Trigger DOM event on passed HTML Element.
     *
     * @param {HTMLElement} element
     * @param {string} type
     */
    Helpers.Event = {
        trigger: function (element, type) {
            var evObj;

            if (element.fireEvent) {
                element.fireEvent('on' + type);
            } else {
                evObj = root.document.createEvent('Events');
                evObj.initEvent(type, true, false);
                element.dispatchEvent(evObj);
            }
        }
    };

}(this));
