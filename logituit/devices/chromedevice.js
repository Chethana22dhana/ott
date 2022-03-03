/**
 * @fileOverview Requirejs modifier for chrome browser.
 */

define("logituit/devices/chromedevice", [
  "logituit/devices/browserdevice",
  "app/appui/globals",
  "logituit/libs/util",

], function (BrowserDevice, Globals, Util) {
  "use strict";
  var self;
  return BrowserDevice.extend({
    init: function init(config) {
      init.base.call(this, config);
      self = this;
      this.VK_LT = 188;
      this.VK_RT = 190;
      this.VK_LB = 100;
      this.VK_RB = 102;

      self.globals = new Globals();
      self.util = new Util();
    },

    /**
     * Get device id
     *
     * @returns device id.
     */
    getDeviceId: function getDeviceId(onSuccess, onFailure) {
      // simulate asynchronous
      var deviceId = self.util.getRandomDeviceId();
      setTimeout(function () {
        onSuccess(deviceId);
      }, 0);
    },
    /**
     * Get device name
     *
     * @returns device name.
     */
    isDeviceConnected: function isDeviceConnected() {
      return Globals.isConnected;
    },
    getDeviceName: function getDeviceName() {
      var u = new Util();
      var info = u.getDeviceInfo();
      return info[0] + ", " + info[1];
    },

    loadURL: function (url, opts) {
      return self.util.loadURL(url, opts);
    },
    /**
     * Get device model
     *
     * @returns device model.
     */
    getModel: function getModel() {
      return Globals.CHROME;
    },

    /**
     * Get platform version
     *
     * @returns platform version.
     */
    getVersion: function getVersion() {
      try {
        var u = new Util();
        var info = u.getDeviceInfo();
        return info[0] + ", " + info[1];
      } catch (ex) {
        return Globals.CHROME;
      }
    },

    /**
     * Get 4K support
     *
     * @returns 4K support.
     */
    isUHDSupported: function isUHDSupported() {
      return false;
    },

    /**
     * Get resolution
     *
     * @returns resolution.
     */
    getResolution: function getResolution() {
      var util = new Util();
      return util.getResolution();
    },
    /**
     * Get platform Type
     *
     * @returns platform Type.
     */
    getPlatformType: function getPlatformType() {
      // return "Smart TV";

      console.log("Platform " + self.globals.GA_PLATFORMS_SUPPORTED.CHROME)
      localStorage.setItem("GA_PLATFORMS_SUPPORTED", self.globals.GA_PLATFORMS_SUPPORTED.CHROME)
      return self.globals.GA_PLATFORMS_SUPPORTED.CHROME

    },

    getLotamePlatform : function getLotamePlatform(){
      localStorage.setItem("LOTAME_PLATFORM_VALUE", self.globals.LOTAME_PLATFORM_VALUE.CHROME);
      return self.globals.LOTAME_PLATFORM_VALUE.CHROME
    },

    getPlatformId: function () {
      return Globals.SMART_TV_PLATFORM_ID;
    },

    /**
     * To get Product Information
     *
     * @returns Product Information
     */
    getProductInfo: function getProductInfo() {
      return Globals.CHROME;
    },

    registerAdditionalKeys: function (device) {
      device._keyMap[this.VK_LT] = this.VK_LT;
      device._keyMap[this.VK_RT] = this.VK_RT;
      device._keyMap[this.VK_LB] = this.VK_LB;
      device._keyMap[this.VK_RB] = this.VK_RB;
    },

    getOS: function getOS() {
      return Globals.CHROME;
    },

    getOsVersion: function getOsVersion() {
      return this.getVersion();
    },
    /**get CMSDK appcode */
    getCatchMediaAppCode: function () {
      return Globals.CM_LGWEBOS_APPCODE;
    },
  });
});
