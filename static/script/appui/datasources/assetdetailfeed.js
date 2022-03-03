define(
    "app/appui/datasources/assetdetailfeed",
    [
      "antie/class",
      'app/appui/globals',
    ],
    function (Class, Globals) {
      return Class.extend({
  
        init: function (feed) {
          // this.globals = new Globals();
          this.data = feed;
        },
  
        loadData: function (callback) {
          if(this.data){
              var feedData = this.data.filter(function (el) {
                  return el.contents != null;
              });
          }
          callback.onSuccess(feedData);
      }
  
      });
    });
  