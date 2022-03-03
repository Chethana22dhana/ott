define("logituit/keyhandlers/activatefirsthandler", [
  "logituit/keyhandlers/keyhandler",
], function (KeyHandler) {
  "use strict";
  return KeyHandler.extend({
    _addAlignmentListeners: function _addAlignmentListeners() {
      var carousel = this._carousel;
      carousel.addEventListener("beforealign", function (ev) {
        if (ev.target === carousel) {
          carousel.setActiveIndex(ev.alignedIndex);
        }
      });
    },
  });
});
