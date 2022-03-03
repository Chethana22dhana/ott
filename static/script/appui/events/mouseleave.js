define('app/appui/events/mouseleave', [
    'antie/events/event'
], function (Event) {
    'use strict';
  
    return Event.extend({
        init: function init (target, pos) {
            this.target = target;
            this.pos = pos;
            init.base.call(this, 'mouseleave');
        }
    });
});