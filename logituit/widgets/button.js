define('logituit/widgets/button', [
  'antie/widgets/button', 'app/appui/events/clickevent', 'app/appui/events/mouseover','app/appui/events/mouseleave'
], function (Button, ClickEvent,mouseover,mouseleave) {
  'use strict'

  return Button.extend({
    init: function init (id, animationEnabled) {
      init.base.call(this, id)
    },
    render: function render (device) {
      var outputElement = render.base.call(this, device)
      var self = this
      outputElement.addEventListener('click', function (e) {
        var pos = {
          x: e.clientX,
          y: e.clientY
        }
        self.click(pos)
      })
      outputElement.addEventListener('mouseover', function(e) {
        var pos = {
          x: e.clientX,
          y: e.clientY
        }
        self.mouseover(pos)
      })
      outputElement.addEventListener('mouseleave', function(e) {
        var pos = {
          x: e.clientX,
          y: e.clientY
        }
        self.mouseleave(pos)
      })
     return outputElement
    },
    click: function select (pos) {
      this.bubbleEvent(new ClickEvent(this, pos))
    },
    mouseover: function (pos) {
      this.bubbleEvent(new mouseover(this, pos))
    },
    mouseleave : function (pos) {
      this.bubbleEvent(new mouseleave(this, pos))
    }
  })
})
