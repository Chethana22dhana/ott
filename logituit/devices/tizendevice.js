/**
 * @fileOverview Requirejs modifier for Tizen-based devices.
 */

define('logituit/devices/tizendevice',
  [ 'logituit/devices/browserdevice', 'antie/events/networkstatuschangeevent',
     'app/appui/globals','logituit/libs/util', 'antie/runtimecontext' ],
  function (BrowserDevice,
    NetworkStatusChangeEvent, Globals, Util, RuntimeContext) {
    'use strict'
    var self
    var deviceConnected = true
    return BrowserDevice.extend({

      init: function init (config) {
        init.base.call(this, config)
        self = this
        self.registerSpecificKeys()
        self.globals = new Globals();
        self.util = new Util()
        webapis.network.addNetworkStateChangeListener(function (status) {
          if (status === webapis.network.NetworkState.GATEWAY_DISCONNECTED ||
            status === 2) {
            status = NetworkStatusChangeEvent.NETWORK_STATUS_OFFLINE
            deviceConnected = false
          } else {
            status = NetworkStatusChangeEvent.NETWORK_STATUS_ONLINE
            deviceConnected = true
          }

          self._application.bubbleEvent(new NetworkStatusChangeEvent(status))
        })
      },

      isDeviceConnected: function isDeviceConnected () {
        return deviceConnected
      },

      /**
     * Get device id
     *
     * @returns device id.
     */
      getDeviceId: function getDeviceId (onSuccess, onFailure) {
        var deviceId = self.util.getRandomDeviceId();
        setTimeout(function () {
          onSuccess(deviceId);
        }, 0);
      },

      registerSpecificKeys: function registerSpecificKeys () {
        var keys = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ]
        for (var i = 0; i < keys.length; i++) {
          try {
            tizen.tvinputdevice.registerKey(keys[i])
          } catch (error) {
            RuntimeContext.getDevice().getLogger().log(
              'failed to register ' + keys[i] + ': ' + error)
          }
        }
      },

      /**
     * Get device name
     *
     * @returns device name.
     */
      getDeviceName: function getDeviceName () {
        try {
          return 'Samsung TV ' + webapis.productinfo.getRealModel()
        } catch (e) {
          return 'Samsung TV'
        }
      },
      /**
       * Get platform Type
       *
       * @returns platform Type.
       */
      getPlatformType: function getPlatformType () {
        console.log("Platform " + self.globals.GA_PLATFORMS_SUPPORTED.SAMSUNG)
        localStorage.setItem("GA_PLATFORMS_SUPPORTED", self.globals.GA_PLATFORMS_SUPPORTED.SAMSUNG)
         return self.globals.GA_PLATFORMS_SUPPORTED.SAMSUNG
      // return Globals.DEVICE_TYPE
      },
      
      getLotamePlatform : function getLotamePlatform(){
        localStorage.setItem("LOTAME_PLATFORM_VALUE", self.globals.LOTAME_PLATFORM_VALUE.SAMSUNG);
        return self.globals.LOTAME_PLATFORM_VALUE.SAMSUNG
      },
      getPlatformModelName: function getPlatformModelName () {
        return Globals.DEVICE_NAME
      },

      /**
     * Get device model
     *
     * @returns device model.
     */
      getModel: function getModel () {
        try {
          var model = webapis.productinfo.getRealModel().charAt(4)
          if (model.indexOf('J') > -1) {
            RuntimeContext.getCurrentApplication().getRootWidget().addClass('samsung-2015')
          }
          if (model.indexOf('K') > -1) {
            RuntimeContext.getCurrentApplication().getRootWidget().addClass('samsung-2016')
          }
          return webapis.productinfo.getRealModel()
        } catch (e) {
          return 'Tizen'
        }
      },

      /**
     * Get platform version
     *
     * @returns platform version.
     */
      getVersion: function getVersion () {
        try {
          var v = navigator.appVersion.match(/\(.*?\)/)

          if (v) { // eg. returns (SMART-TV; LINUX; Tizen 3.0), need to remove
          // parenthesis
            return v[0].replace(/[()]/g, '')
          }

          return ''
        } catch (e) {
          return ''
        }
      },

      /**
     * Get 4K support
     *
     * @returns 4K support.
     */
      isUHDSupported: function isUHDSupported () {
        try {
          return webapis.productinfo.isUdPanelSupported()
        } catch (e) {
          return false
        }
      },

      /**
     * Get resolution
     *
     * @returns resolution.
     */
      getResolution: function getResolution () {
        var util = new Util()
        return util.getResolution()
      },

      /**
       * To get Product Information
       *
       * @returns Product Information
       */
      getProductInfo: function getProductInfo () {
        return Globals.SAMSUNG_TIZEN
      },

      loadURL: function (url, opts) {
        return self.util.loadURL(url, opts)
      },

      getPlatformId: function () {
        return Globals.SMART_TV_PLATFORM_ID
      },

      registerAdditionalKeys: function () {
        return false
      },

      getOS: function getOS () {
        return Globals.TIZEN_OS
      },

      getOsVersion: function getOsVersion () {
        return this.getVersion()
      },
      /**get CMSDK appcode */
      getCatchMediaAppCode: function () {
        return Globals.CM_TIZEN_APPCODE;
      }
    })
  })
