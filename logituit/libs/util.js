define("logituit/libs/util", [
  "antie/class",
  "app/appui/globals",
  "antie/runtimecontext",
  "app/appui/services/helperService",
], function (Class, Globals, RuntimeContext, HelperService) {
  "use strict";
  var self;
  var Utils = Class.extend({
    init: function () {
      this.globals = new Globals();
      this.application = RuntimeContext.getCurrentApplication();
      // console.log(this.application);
      self = this;
      self.CheckRefreshXHR = null;
      self.mergeJson();
    },
    getResolution: function getResolution() {
      try {
        return window.outerWidth + "," + window.outerHeight;
      } catch (e) {
        return "";
      }
    },
    clearAllContainers: function () {
      var rootWidget = this.application.getRootWidget();
      rootWidget
        .getChildWidget(this.globals.DETAIL_CONTAINER)
        .removeChildWidgets();
      /**Write for other containers you create */
    },
    getDeviceInfo: function () {
      if (navigator.userAgent.indexOf("SmartTV; Maple2012") >= 0) {
        return ["samsung", "2012"];
      } else if (navigator.userAgent.indexOf("SmartTV+2013; Maple2012") >= 0) {
        return ["samsung", "2013"];
      } else if (navigator.userAgent.indexOf("SmartTV+2014; Maple2012") >= 0) {
        return ["samsung", "2014"];
      } else if (navigator.userAgent.indexOf("SmartTV+2015; Maple2012") >= 0) {
        return ["samsung", "2015"];
      } else if (navigator.userAgent.indexOf("Tizen") >= 0) {
        if (navigator.userAgent.indexOf("Tizen 2.3") >= 0) {
          return ["tizen", "2015"];
        } else if (navigator.userAgent.indexOf("Tizen 2.4.0") >= 0) {
          return ["tizen", "2016"];
        }
        return ["tizen", "2015"];
      } else if (navigator.userAgent.indexOf("LG NetCast.TV-2011") >= 0) {
        return ["lg", "2011"];
      } else if (navigator.userAgent.indexOf("LG NetCast.TV-2012") >= 0) {
        return ["lg", "2012"];
      } else if (navigator.userAgent.indexOf("LG NetCast.TV") >= 0) {
        return ["lg", "2013"];
      } else if (navigator.userAgent.indexOf("LG SimpleSmart.TV-2016") >= 0) {
        return ["lg", "2016"];
      } else if (
        navigator.userAgent.indexOf("Web0S") >= 0 &&
        navigator.userAgent.indexOf("537.41") >= 0
      ) {
        return ["webos", "1.x"];
      } else if (
        navigator.userAgent.indexOf("Web0S") >= 0 &&
        navigator.userAgent.indexOf("538.2") >= 0
      ) {
        return ["webos", "2.x"];
      } else if (
        navigator.userAgent.indexOf("Web0S") >= 0 &&
        navigator.userAgent.indexOf("537.36") >= 0
      ) {
        return ["webos", "3.x"];
      } else if (navigator.userAgent.indexOf("Web0S") >= 0) {
        return ["webos", ""];
        // to cover the new models
        // comming from future
      } else if (navigator.userAgent.indexOf("PIXEL_UNICORN") >= 0) {
        return ["Sony", ""];
      } else if (navigator.userAgent.indexOf("SIERRA") >= 0) {
        return ["Foxxum", ""];
      } else if (navigator.userAgent.indexOf("Hisense") >= 0) {
        return ["Vidaa", ""];
      } else if (navigator.userAgent.indexOf("Chrome") >= 0) {
        var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
        var version = raw ? parseInt(raw[2], 10) : false;
        return ["chrome", version];
      }
      return ["default", ""];
    },

    isSamsung2016: function () {
      var userAgent = navigator.userAgent;
      if (userAgent.includes("Tizen 2.4")) {
        return true;
      } else {
        return false;
      }
    },

    hideContainer: function (container) {
      this.application
        .getRootWidget()
        .getChildWidget(container)
        .addClass("display-none");
    },

    showContainer: function (container) {
      if (this.application.getRootWidget().getChildWidget(container)) {
        this.application
          .getRootWidget()
          .getChildWidget(container)
          .removeClass("display-none");
      }
      this.application.setActiveComponent(container);
      if (container === self.globals.HOME_CONTAINER) {
        var event = new CustomEvent("onShowHome");
        document.dispatchEvent(event);
      }
      /*if (!(this.application.getRootWidget().getChildWidget(
						this.globals.ERROR_CONTAINER).getChildWidgetCount())) {
						this.application.setActiveComponent(container)
					}*/
    },

    displayContainer: function (container) {
      this.application
        .getRootWidget()
        .getChildWidget(container)
        .removeClass("display-none");
    },

    ActivateMainContainer: function () {
      this.application
        .getRootWidget()
        .getChildWidget(this.globals.MAIN_CONTAINER)
        .removeClass("unFocus");
    },

    deActivateMainContainer: function () {
      this.application
        .getRootWidget()
        .getChildWidget(this.globals.MAIN_CONTAINER)
        .addClass("unFocus");
    },

    clearMainContainerHistory: function () {
      this.application
        .getRootWidget()
        .getChildWidget(this.globals.MAIN_CONTAINER)._historyStack = [];
    },

    showToast: function (msg, toastClass) {
      let timeout;
      let toastClassMain = toastClass || "show_toast";
      this.application.getRootWidget().getChildWidget("toast").setText(msg);
      this.application
        .getRootWidget()
        .getChildWidget("toast")
        .addClass(toastClassMain);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.application
          .getRootWidget()
          .getChildWidget("toast")
          .removeClass(toastClassMain);
      }, 3000);
    },

    hideToast: function (toastClassMain) {
      this.application
        .getRootWidget()
        .getChildWidget("toast")
        .removeClass(toastClassMain);
    },
    loadURL: function loadURL(url, opts) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          xhr.onreadystatechange = null;
          if (xhr.status >= 200 && xhr.status < 300) {
            if (opts.onLoad) {
              opts.onLoad(xhr.responseText, xhr.status);
            }
          } else if (xhr.status === 0) {
            console.log("Please check your internet connection");
          } else {
            if (opts.onError) {
              opts.onError(xhr.responseText, xhr.status);
            }
          }
        }
      };
      xhr.timeout = opts.timeout || Globals.TIMEOUT;
      xhr.ontimeout = function (e) {
        if (opts.onError) {
          if (!xhr.status) {
            opts.onError(xhr.responseText, 408);
          } else {
            opts.onError(xhr.responseText, xhr.status);
          }
        }
      };
      try {
        xhr.open(opts.method || "GET", url, true);
        if (opts && opts.headers) {
          for (var header in opts.headers) {
            if (opts.headers.hasOwnProperty(header)) {
              xhr.setRequestHeader(header, opts.headers[header]);
            }
          }
        }
        if (
          url.indexOf(Globals.BASE_API) > -1 &&
          url.indexOf("profiles") === -1 &&
          Globals.PROFILE_ID
        ) {
          xhr.setRequestHeader(Globals.PROFILE_HEADER, Globals.PROFILE_ID);
        }
        xhr.send(opts.data || null);
      } catch (ex) {
        if (opts.onError) {
          opts.onError(ex);
        }
      }
      return xhr;
    },
    mergeJson() {
      if (typeof Object.assign !== "function") {
        // Must be writable: true, enumerable: false, configurable: true
        Object.defineProperty(Object, "assign", {
          value: function assign(target, varArgs) {
            // .length of function is 2
            "use strict";
            if (target === null || target === undefined) {
              throw new TypeError("Cannot convert undefined or null to object");
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
              var nextSource = arguments[index];

              if (nextSource !== null && nextSource !== undefined) {
                for (var nextKey in nextSource) {
                  // Avoid bugs when hasOwnProperty is shadowed
                  if (
                    Object.prototype.hasOwnProperty.call(nextSource, nextKey)
                  ) {
                    to[nextKey] = nextSource[nextKey];
                  }
                }
              }
            }
            return to;
          },
          writable: true,
          configurable: true,
        });
      }
    },
    isTizen() {
      var deviceInfoDetails = this.getDeviceInfo();
      var deviceInfo =
        deviceInfoDetails && deviceInfoDetails.length
          ? deviceInfoDetails[0]
          : null;
      var isDeviceInList = ["tizen"].indexOf(deviceInfo);
      if (isDeviceInList > -1) {
        return true;
      }
    },
    getRandomDeviceId: function () {
      return HelperService.setDeviceId();
    },
    getLayoutWidth: function (layout) {
      const carouselLayouts = this.application.getLayout().carouselLayouts;
      const { CAROUSEL_LAYOUT } = this.globals.API_CONSTANTS;
      var layoutDimention = {};
      switch (layout) {
        case CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT:
        case CAROUSEL_LAYOUT.CONTINUE_WATCH_LAYOUT:
          layoutDimention["width"] =
            carouselLayouts[CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT].width;
          layoutDimention["height"] =
            carouselLayouts[CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT].height;
          break;
        case CAROUSEL_LAYOUT.BACKGROUND_IMG_LAYOUT:
          layoutDimention["width"] =
            carouselLayouts[CAROUSEL_LAYOUT.BACKGROUND_IMG_LAYOUT].width;
          layoutDimention["height"] =
            carouselLayouts[CAROUSEL_LAYOUT.BACKGROUND_IMG_LAYOUT].height;
          break;
        case CAROUSEL_LAYOUT.PORTRAIT_LAYOUT:
          layoutDimention["width"] =
            carouselLayouts[CAROUSEL_LAYOUT.PORTRAIT_LAYOUT].width;
          layoutDimention["height"] =
            carouselLayouts[CAROUSEL_LAYOUT.PORTRAIT_LAYOUT].height;
          break;
        case CAROUSEL_LAYOUT.SQUARE_LAYOUT:
          layoutDimention["width"] =
            carouselLayouts[CAROUSEL_LAYOUT.SQUARE_LAYOUT].width;
          layoutDimention["height"] =
            carouselLayouts[CAROUSEL_LAYOUT.SQUARE_LAYOUT].height;
          break;
      }
      return layoutDimention;
    },
    getCloudinaryUrl: function (layout, quality = null) {
      var cloudinaryUrl = Globals.IMAGE_CLOUDINARY_PATH;
      var layoutDimentions = this.getLayoutWidth(layout);
      if (layoutDimentions) {
        if (layoutDimentions.width) {
          cloudinaryUrl = cloudinaryUrl.replace(
            "$width",
            layoutDimentions.width
          );
        } else {
          cloudinaryUrl = cloudinaryUrl.replace(",w_$width", "");
        }
        if (layoutDimentions.height) {
          cloudinaryUrl = cloudinaryUrl.replace(
            "$height",
            layoutDimentions.height
          );
        } else {
          cloudinaryUrl = cloudinaryUrl
            .replace(",h_$height", "")
            .replace(",ar_16:9", "");
        }
        if (quality) {
          cloudinaryUrl = cloudinaryUrl.replace("$quality", quality);
        } else {
          cloudinaryUrl = cloudinaryUrl.replace("$quality", "70");
        }
        layoutDimentions = null;
        return cloudinaryUrl;
      } else {
        cloudinaryUrl = null;
        return Globals.Constants.IMAGE_CDNCROP;
      }
    },

    // Creating Data formatter for Spotlight in home component
    createSpotlightDataFormatHomecmp(data) {
      if (!data) {
        return {};
      }
      let dataItem = {
        id: data.id ? data.id : null,
        layout: data.layout ? data.layout : null,
        actions: data.actions ? data.actions : null,
        isLive:
          data && data.metadata && data.metadata.isLive
            ? data.metadata.isLive
            : false,
        total: data.total ? data.total : null,
        metadata: {
          emfAttributes: {},
          objectSubtype: data.metadata.objectSubtype,
          retrieveItems_uri: data.metadata.retrieveItems_uri
            ? data.metadata.retrieveItems_uri
            : null,
          layout: data.layout ? data.layout : null,
          rail_label: data.metadata.rail_label
            ? data.metadata.rail_label
            : null,
        },
        editorialMetadata: {},
        // editorialMetadata : (data.editorialMetadata) ? data.editorialMetadata : null,
        platformVariants: data.platformVariants ? data.platformVariants : null,
      };
      if (
        data &&
        data.metadata &&
        data.metadata.emfAttributes &&
        data.metadata.emfAttributes.packageid
      ) {
        dataItem.metadata.emfAttributes["packageid"] =
          data.metadata.emfAttributes.packageid;
      }
      this.populateSpotLightMetada(dataItem, data.metadata);
      this.populateSpotLightEditorialMetadata(dataItem, data.editorialMetadata);
      return dataItem;
    },

    moveElement: function (element, direction, amount) {
      switch (direction) {
        case Utils.DIRECTION_X:
          if(element != null) {
          element.style.transform = 'translateX(' + amount + 'px)'
          element.style['-webkit-transform'] = 'translate(' + amount +
            'px,' + '0px)'
          element.style['-ms-transform'] = 'translate(' + amount + 'px,' +
            '0px)'
          }
          break
        case Utils.DIRECTION_Y:
          if(element != null) {
          element.style.transform = 'translateY(' + amount + 'px)'
          element.style['-webkit-transform'] = 'translate(0px,' + amount +
            'px)'
          element.style['-ms-transform'] = 'translate(0px,' + amount +
            'px)'
          }
          break
      }
    },
    populateSpotLightMetada(targetObject, metadata) {
      if (metadata) {
        if (!targetObject.metadata) {
          targetObject["metadata"] = {
            emfAttributes: {},
          };
        }
        targetObject.metadata["episodeTitle"] = metadata.episodeTitle
          ? metadata.episodeTitle
          : null;
        targetObject.metadata["title"] = metadata.title ? metadata.title : null;
        targetObject.metadata["contentId"] = metadata.contentId
          ? metadata.contentId
          : null;
        targetObject.metadata["genres"] = metadata.genres
          ? metadata.genres
          : null;
        targetObject.metadata["language"] = metadata.language
          ? metadata.language
          : null;
        targetObject.metadata["pcVodLabel"] = metadata.pcVodLabel
          ? metadata.pcVodLabel
          : null;
        targetObject.metadata["duration"] = metadata.duration
          ? metadata.duration
          : null;
        targetObject.metadata["externalId"] = metadata.externalId
          ? metadata.externalId
          : null;
      }
    },

    populateSpotLightEditorialMetadata(targetObject, editorialMetadata) {
      if (editorialMetadata) {
        if (!targetObject.editorialMetadata) {
          targetObject["editorialMetadata"] = {};
        }
        targetObject.editorialMetadata["spotlight_items"] =
          editorialMetadata.spotlight_items
            ? editorialMetadata.spotlight_items
            : null;
      }
    },
    createCarouselData(data) {
      if (!data) {
        return {}
      }
      let dataItem = {
        id: (data.id) ? data.id : null,
        layout: (data.layout) ? data.layout : null,
        position: (data.position) ? data.position : null,
        content_position: (data.content_position) ? data.content_position : null,
        actions: (data.actions) ? data.actions : null,
        total : data.total ? data.total : null,
        img : data.images && data.images[8] ? data.images[8] : data.images && data.images[15] ? data.images[15] : data.images && data.images[16] ? data.images[16] : null,
        metadata: {
          emfAttributes: {}
        },
        rank: (data.rank) ? data.rank : null,
        editorialMetadata: {},
        platformVariants: (data.platformVariants) ? data.platformVariants : {}
      }
      // this.populateMetada(dataItem, data.metadata);
      // this.populateEditorialMetadata(dataItem, data.editorialMetadata);
      return dataItem;
    },
    getDeviceData: function getDeviceData() {
      var DEVICE_MANUFACTURER = "";
      var DEVICE_BRAND = "";
      var Device_Type = Globals.CHROME;
      var Device_Category = Globals.CHROME;
      var deviceData = {};
      var device = RuntimeContext.getDevice();
      // var platformtype = this.removeSymbols(device.getPlatformType())
      var platformtype = device.getPlatformType();
      var lotamePlatformValue = device.getLotamePlatform();
      var deviceName = device.getDeviceName();
      var deviceDetail = deviceName.substring(0, deviceName.indexOf(" "));
      var deviceOS = device.getOS();
      var version = device.getOsVersion();
      if (deviceOS === Globals.TIZEN_OS || deviceOS === Globals.LG_OS) {
        version = this.getVersionNumber(version);
      }
      if (platformtype === Globals.XBOX_DEVICE_NAME) {
        platformtype = Globals.CONSOLE_DEVICE;
        deviceDetail = Globals.XBOX_DEVICE_NAME;
      }
      deviceData.platform = platformtype;
      deviceData.lotamePlatformValue = lotamePlatformValue;
      deviceData.device_detail = deviceDetail;
      deviceData.device_os_version = version;
      if (
        navigator.userAgent.includes(Globals.USER_AGENT_IDENTIFIERS.NETRANGE)
      ) {
        DEVICE_BRAND = Globals.NETRANGE_BRAND;
        DEVICE_MANUFACTURER = Globals.NETRANGE_BRAND;
        deviceOS = Globals.htmlDeviceOs;
      } else if (
        navigator.userAgent.includes(Globals.USER_AGENT_IDENTIFIERS.SONY)
      ) {
        DEVICE_BRAND = Globals.SONY_BRAND;
        DEVICE_MANUFACTURER = Globals.SONY_NAME;
        deviceOS = Globals.htmlDeviceOs;
      } else if (
        navigator.userAgent.includes(Globals.USER_AGENT_IDENTIFIERS.FOXXUM)
      ) {
        DEVICE_BRAND = Globals.FOXXUM_BRAND;
        DEVICE_MANUFACTURER = Globals.FOXXUM_BRAND;
        deviceOS = Globals.htmlDeviceOs;
      }
      deviceData.device_os = deviceOS;
      deviceData.DEVICE_BRAND = DEVICE_BRAND;
      deviceData.DEVICE_MANUFACTURER = DEVICE_MANUFACTURER;
      deviceData.Device_Type = Device_Type;
      deviceData.Device_Category = Device_Category;
      return deviceData;
    },
  });
  Utils.DIRECTION_X = 1
  Utils.DIRECTION_Y = 2
  return Utils;
});
