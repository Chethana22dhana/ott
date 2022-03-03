/**
 *This is the launchscreen.js page for ErosNow application.
 *This page is loaded when the application is launched
 */
// Including the required widgets
require.def(
  "app/appui/launchscreen",
  [
    "antie/class",
    "antie/runtimecontext",
    "app/appui/globals",
    "logituit/libs/util",
  ],
  function (Class, RuntimeContext, Globals, Util) {
    var self;
    return Class.extend({
      init: function () {
        self = this;
        self.device = RuntimeContext.getDevice();
        self.application = RuntimeContext.getCurrentApplication();
        self.globals = new Globals();
        self.util = new Util();
        self.loadSplash();
      },
      
      // To navigateto home
      goToHome: function () {
         self.util.application.pushComponent(self.globals.MENU_CONTAINER,
         self.globals.COMPONENT_PATH.MENU_COMPONENT);
        self.util.application.pushComponent(
          self.globals.MAIN_CONTAINER,
          self.globals.COMPONENT_PATH.HOME_COMPONENT);
      },

      hideSplash: function () {
        self.goToHome();
        self.util.application.popComponent(
          self.globals.SPLASH_CONTAINER,
          self.globals.COMPONENT_PATH.SPLASH_COMPONENT
        );
      },
      loadSplash: function () {
        // self.globals.setCMPageLoadStartTime();
        self.util.application.pushComponent(
          self.globals.SPLASH_CONTAINER,
          self.globals.COMPONENT_PATH.SPLASH_COMPONENT
        );
        setTimeout(()=>{
          self.hideSplash();
        },self.globals.DELAY.SPLASHCOMPONENT);
      },
    });
  }
);
