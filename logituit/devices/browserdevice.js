/**
 * @fileOverview Requirejs modifier for chrome browser.
 */

define('logituit/devices/browserdevice', [
  'antie/devices/browserdevice', 'antie/events/keyevent', 'logituit/libs/util'
], function (BrowserDevice, KeyEvent, Util) {
  'use strict'
  var self
  return BrowserDevice.extend({
    init: function init (config) {
      init.base.call(this, config)
      self = this
      self.util = new Util()
    },
    addKeyEventListener: function addKeyEventListener () {
      addKeyEventListener.base.call(this)
      var self = this
      var keyDelay = 100

      document.onmousewheel = function (e) {
        e = e || window.event
        if (e.deltaY > 0) {
          self._application.bubbleEvent(new KeyEvent('keydown',
            KeyEvent.VK_DOWN))
          setTimeout(function () {
            self._application.bubbleEvent(new KeyEvent('keyup',
              KeyEvent.VK_DOWN))
          }, keyDelay)
        } else {
          self._application.bubbleEvent(new KeyEvent('keydown',
            KeyEvent.VK_UP))
          setTimeout(function () {
            self._application.bubbleEvent(new KeyEvent('keyup',
              KeyEvent.VK_UP))
          }, keyDelay)
        }
        e.preventDefault()
      }
    },

    loadURL: function (url, opts) {
      return self.util.loadURL(url, opts)
    },
    isLauncherAvailable: function isLauncherAvailable () {
      return false
    },
    showLauncher: function showLauncher () {
      this.exit()
    }
  })
})
