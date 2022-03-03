define(
    "app/appui/datasources/splashfeed",
    [
      "antie/class"
    ],
    function(Class) {
      return Class.extend({
        // You will probably want to do something more useful then returning static data
        loadSplash : function(callbacks) {
          callbacks.onSuccess(
            [
              {
                "id":"1",
                "img" : "static/img/splash/en_new_logo.svg"
              },
              
            ]
            
        );
      }
   });
 });