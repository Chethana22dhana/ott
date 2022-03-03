/**
 *This is the globals.js page for sonyLiv application.
 *This page have all the constant values and strings required in the application and globally used functions
 */
// Including the required widgets
require.def(
  "app/appui/globals",
  [
      "antie/class", 
      "antie/runtimecontext", 
      "app/appui/constants/apiInfo",
      "app/appui/services/helperService",
],
  // Initiating the function with required parameters and global variabel declaration
    function (Class, RunTimeContext, API_INFO, HelperService) {
        "use strict";

        var ID = {
            BASE_API_DEV: 'https://stgapigateway.erosnow.com/',
            BASE_API_STAGE: 'https://stgapigateway.erosnow.com/',
            BASE_API: 'https://stgapigateway.erosnow.com/',
            BASE_API_PROD: 'https://stgapigateway.erosnow.com/',
        };
        var APIDATA = {
            API: 'api/',
            VERSION: 'v1/',
            USER: 'users/',
            AUTH: 'auth/',
            CORE: 'core/',
            PAGES: 'pages/',
            X_API_CLIENT: 'U1e9OXjEdPrK1lQdYvlZxLooLKRjyO0xvD1NJJuc',
            X_PLATFORM: 'WEB',
            X_COUNTRY: 'IN',
            X_DEVICE_ID: '9d4c94f0-ef86-11eb-8480-c79760111465',
            Content_Type: 'application/json'
        };

        var self;
        var Constants = Class.extend({
        init: function () {
            self = this;
            this.BASE_EROS_API = ID.BASE_API_STAGE;
            this.XHR_METHOD_GET = 'GET';
            this.XHR_METHOD_POST = 'POST';
            this.deviceId = HelperService.setDeviceId();
            this.GENERATE_ACTIVATION_CODE = this.BASE_EROS_API + APIDATA.API + APIDATA.VERSION + APIDATA.AUTH + APIDATA.USER + 
                'code/generate';
            this.GET_MENU = this.BASE_EROS_API + APIDATA.API + APIDATA.VERSION + APIDATA.CORE +'common/navigation';
            this.HOME_PAGE_API = this.BASE_EROS_API + APIDATA.API + APIDATA.VERSION + APIDATA.CORE + APIDATA.PAGES;
            this.ASSET_DETAILS = this.BASE_EROS_API + APIDATA.API + APIDATA.VERSION + APIDATA.CORE + 'assets/l/';
            this.ACTIVATE_DEVICE_CODE = this.BASE_EROS_API + APIDATA.API + APIDATA.VERSION + APIDATA.AUTH + APIDATA.USER + 'login_with_code';
            this.CONTENT_PROFILE_API = this.BASE_EROS_API + APIDATA.API + APIDATA.VERSION + APIDATA.CORE + 'content_profile/';
            this.TRENDING_SEARCH = this.BASE_EROS_API + APIDATA.API + APIDATA.VERSION + APIDATA.CORE +'search/trending_search'
            this.CONTENT_SEARCH = this.BASE_EROS_API + APIDATA.API + APIDATA.VERSION + APIDATA.CORE +'search/common?search_term=';
        },
            AUTH_TOKEN_KEY: 'auth_token',

            MAIN_CONTAINER: 'main_container',
            HOMECAROUSEL_CONTAINER: 'homecarousel_container',
            SPOTLIGHT_CONTAINER: 'spotlight_container',
            SEARCH_CONTAINER: 'search_container',
            DETAIL_CONTAINER: 'detail_container',
            HOME_CONTAINER: 'home_container',
            ERROR_CONTAINER: 'error_container',
            CAROUSEL_CONTAINER: 'carouselComponent',
            HOME_COMPONENT: 'home_component',
            MENU_CONTAINER: 'menu_container',
            HOMECAROUSEL_COMPONENT: 'homecarousel_component',
            DETAIL_COMPONENT: 'detail_component',
            SPLASH_CONTAINER: 'splash_container',
            ASSET_DETAIL_CONTAINER :'asset_detal_container',
            PLAYER_CONTAINER: 'player_container',
            SIGNIN_CONTAINER:'signin_container',
            LISTING_CONTAINER: 'listing_page',
            SIDEMENU_CONTAINER:'sidebar_container',
            SUBSCRIPTION_CONTAINER:'subscription_container',

            COMPONENT_PATH: {
                // LANDING_PAGE: 'app/appui/components/landingPage',
                HOME_COMPONENT: 'app/appui/components/homecomponent',
                SPLASH_COMPONENT: 'app/appui/components/splashcomponent',
                MENU_COMPONENT:'app/appui/components/menucomponent',
                ASSET_DETAIL_COMPONENT :'app/appui/components/assetdetailcomponent',
                SHOWS_COMPONENT: 'app/appui/components/showscomponent',
                SEARCH_COMPONENT:'app/appui/components/searchcomponent',
                SIGNIN_COMPONENT:'app/appui/components/signincomponent',
                PLAYER_COMPONENT: 'app/appui/components/playercomponent',
                LIBRARY_COMPONENT: 'app/appui/components/librarycomponent',
                LISTING_PAGE_COMPONENT: 'app/appui/components/listinglandscapecomponent',
                SUBSCRIPTION_COMPONENT:'app/appui/components/subscriptioncomponent',
            },

            DELAY: {
                HOMECOMPONENT: 100,
                SPLASHCOMPONENT: 3000,
                DELAY_1000: 1000,
                DETAILPAGE: 2000,
            },

            GA_PLATFORMS_SUPPORTED: {
                SAMSUNG: "Samsung TV",
                LG_WEBOS: "LG TV",
                SONY: "Sony TV",
                CHROME: "Smart TV",
                NETRANGE: "Netrange TV",
                CLOUDWALKER: "Cloudwalker",
                FOXUMM: "Foxxum TV",
                VIDAA: "Vidaa TV",
            },
            SALES_DEVICE_CHANNEL: {
                SAMSUNG: "SAMSUNG_HTML_TV/",
                SONY: "SONY_HTML_TV/",
                LG: "LG_HTML_TV/",
                NETRANGE: "NETRANGE_HTML_TV/",
                FOXXUM: "FOXXUM_HTML_TV/",
                VIDAA: "VIDAA_HTML_TV/",
            },
            LOTAME_PLATFORM_VALUE: {
                SAMSUNG: "SMSG",
                LG_WEBOS: "LGTV",
                SONY: "SONY",
                CHROME: "SMARTTV",
                NETRANGE: "NETRANGETV",
                CLOUDWALKER: "CLOUDWALKER",
                FOXUMM: "FOXUMMTV",
                VIDAA: "VIDAA",
            },
            API_CONSTANTS: {
                CAROUSEL_LAYOUT: {
                LANDSCAPE_LAYOUT: "landscape_layout",
                BACKGROUND_IMG_LAYOUT: "BACKGROUND_IMG_LAYOUT",
                SPOTLIGHT_LAYOUT: "spotlight_layout",
                SPOTLIGHT_LOGO: "spotlight_logo",
                PORTRAIT_LAYOUT: "portrait_layout",
                SQUARE_LAYOUT: "square_layout",
                LISTING_LANDSCAPE_LAYOUT: "listing_landscape_layout",
                CONTINUE_WATCH_LAYOUT: "continue_watch_layout",
                },
                CAROUSEL_LAYOUT_ARRAY: [
                    'square_layout',
                    'landscape_layout',
                    'portrait_layout',
                    'continue_watch_layout'
                ],
            },

            logger: function () {
                return RunTimeContext.getDevice().getLogger();
            },
            callForAPI: function (method, data, headers, url, successCallback, errorCallback, timeout) {
                // let apiData = {};
                let uUrl = url;
                let uMethod = method;
                let uData = data;
                let uTimeout = timeout || null;
                headers={
                    'x-api-client': APIDATA.X_API_CLIENT,
                    'x-platform': APIDATA.X_PLATFORM,
                    'x-country': APIDATA.X_COUNTRY,
                    'x-device-id': this.deviceId,
                    'Content-Type': 'application/json'
                }
                var uHeaders = headers;
                this.device = RunTimeContext.getDevice();
                this.HOME_XHR = (this.device
                    .loadURL(LOCAL_HOST + uUrl, {
                        method: uMethod,
                        data: uData ? JSON.stringify(uData) ? JSON.stringify(uData) : null : null,
                        timeout: uTimeout,
                        onLoad: function (responsetext) {
                            var responseObject = responsetext;
                            try {
                                responseObject = JSON
                                    .parse(responseObject);
                            } catch (e) {
                            }
                            if (responseObject) {
                                successCallback(responseObject);
                            }
                        },
                        onError: function (responseObject, status) {
                            try {
                                var resp;
                                if(responseObject){
                                    resp = responseObject ? JSON.parse(responseObject) : false;
                                }
                                var respData = {
                                    resp: resp,
                                    status: status
                                };
                                if (responseObject) {
                                    var data = JSON.parse(responseObject);
                                    if (errorCallback) {
                                        errorCallback(data, status);
                                    }
                                }
                            }
                            catch(e){
                                console.log(e);
                            }
                        },
                        headers: uHeaders ? uHeaders : null,
                    })
                    )
            },
            setAccessToken: function (token) {
                localStorage.setItem(self.AUTH_TOKEN_KEY, token);
            },
            // to get access token from local storage
            getAccessToken: function (token) {
                return localStorage.getItem(self.AUTH_TOKEN_KEY);
            },
            getDetailApi: function (path) {
                // var state_code = self.getStateCode();
                // var country_code = self.getCountryCode();
                var path = path;
                return path;
                // var contactId = self.getContactID();
                // if (start >= 0 && end) {
                //     if (contactId) {
                //         var url = (seasonNumber) ? `${path}?seasonNumber=${seasonNumber}&contactId=${contactId}&from=${start}&to=${end}`: `${path}?contactId=${contactId}&from=${start}&to=${end}`;
                //         return url;
                //     } else {
                //         var url = (seasonNumber) ? `${path}?seasonNumber=${seasonNumber}&from=${start}&to=${end}` : `${path}?from=${start}&to=${end}`;
                //         return url;
                //     }
                // } else {
                //     if (contactId) {
                //         var url = (seasonNumber) ? `${path}?seasonNumber=${seasonNumber}&contactId=${contactId}`:`${path}?contactId=${contactId}`;
                //         return url;
                //     } else {
                //         return (seasonNumber) ? `${path}?seasonNumber=${seasonNumber}` : `${path}`;
                //     }
                // }
            },
            CSS_CONSTANTS: {
                HD: 720,
                FULL_HD: 1080,
                SUBSCRIPTION_PT_HD: 66 + "px",
                SUBSCRIPTION_PT_FULL_HD: 99 + "px",
                LIVENOW_PT_HD: 287.33 + "px",
                LIVENOW_PT_FULL_HD: 431 + "px",
                LANDSCAPE_PT_HD: 286 + "px",
                LANDSCAPE_PT_FULL_HD: 429 + "px",
                CLASS_WRAPPING_STRIP: "wrapping-strip",
            },
        });
        Constants.IMAGE_CDNCROP =
        " https://res.cloudinary.com/dwaynejohnson/image/fetch/f_auto,q_auto,e_contrast:30,e_brightness:10,ar_16:9,c_crop/";
        Constants.IMAGE_CLOUDINARY_PATH =
        "https://res.cloudinary.com/dwaynejohnson/image/fetch/q_$quality,fl_lossy,w_$width,h_$height,e_contrast:30,e_brightness:10,ar_16:9,c_scale/";
        Constants.ACTIVATION_CODE_POLL = 5000;

        return Constants;
    }
);
