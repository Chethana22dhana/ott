/**
*This is the app.js page for sonyLiv application.
*This page loads all the containers required beforehand,initialises catchmedia and deeplink services 
*/
// Including the required widgets
require.def('app/appui/app', ['antie/application', 'antie/widgets/container',
    'antie/runtimecontext', 'antie/storageprovider',
    'app/appui/events/pausedevent', 'app/appui/events/resumedevent',
    'app/appui/globals', 'logituit/libs/util',
    'antie/widgets/textpager',
    'app/appui/launchscreen',
],
// Initiating the function with required parameters and global variabel declaration
function (Application, Container,
    RuntimeContext, StorageProvider, PausedEvent, ResumedEvent, Globals, Util, TextPager,Launchscreen) {
    'use strict';
    var self;
    return Application.extend({
        init: function (appDiv, styleDir, imgDir, callback) {
            this.init.base.call(this, appDiv, styleDir, imgDir, callback);
            self = this;
            self.globals = new Globals();
            self.toast = new TextPager('toast');
            self.util = new Util();
            self._setRootContainer = function () {
                var container = new Container();
                container.outputElement = appDiv;
                self.setRootWidget(container);
            };

            self._handleVisibilityChange = function () {
                if (document.visibilityState === 'hidden') {
                    Application.getCurrentApplication().bubbleEvent(new PausedEvent());
                } else if (document.visibilityState === 'visible') {
                    Application.getCurrentApplication().bubbleEvent(new ResumedEvent());
                }
            };

            // app paused and resume event handling
            if ('hidden' in document) {
                document.addEventListener('visibilitychange',
                    self._handleVisibilityChange);
            } else if ('webkitHidden' in document) {
                document.addEventListener('webkitvisibilitychange',
                    self._handleVisibilityChange);
            }
        },
        // Called from run() as we need the framework to be ready
        // beforehand.
        run: function () {
            this._setRootContainer();
            var device = RuntimeContext.getDevice();
            self.deviceModel = device.getModel();
            device.registerAdditionalKeys(device);
            self.getRootWidget().appendChildWidget(self.toast);
            self.storage = device.getStorage(StorageProvider.STORAGE_TYPE_PERSISTENT);
            self.addComponentContainer(self.globals.MAIN_CONTAINER);
            self.addComponentContainer(self.globals.SPOTLIGHT_CONTAINER);
            self.addComponentContainer(self.globals.MENU_CONTAINER);
            self.addComponentContainer(self.globals.HOMECAROUSEL_CONTAINER);
            self.addComponentContainer(self.globals.PLAYER_CONTAINER);
            self.addComponentContainer(self.globals.HOME_CONTAINER);
            self.addComponentContainer(self.globals.ERROR_CONTAINER);
            self.addComponentContainer(self.globals.SPLASH_CONTAINER);
            self.addComponentContainer(self.globals.ASSET_DETAIL_CONTAINER);
            self.addComponentContainer(self.globals.SEARCH_CONTAINER);
            self.addComponentContainer(self.globals.SIGNIN_CONTAINER)
            self.addComponentContainer(self.globals.LIBRARY_CONTAINER);
            self.addComponentContainer(self.globals.LISTING_CONTAINER);
            self.addComponentContainer(self.globals.SIDEMENU_CONTAINER);
            self.addComponentContainer(self.globals.SUBSCRIPTION_CONTAINER)
            self.catchMediaAppCode = device.getCatchMediaAppCode();
            Globals.deviceName = device.getDeviceName();
            Globals.deviceModelNumber = device.getModel();

            self.deviceName = Globals.deviceName;
            self.launchscreen = new Launchscreen();
        },

    });
});
