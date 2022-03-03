define(
    "app/appui/datasources/assetdetailcarouselhorizontalfeed",
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
              var feedData = this.data.contents.filter(function (el) {
                  return el != null;
              });
          }
          callback.onSuccess(feedData);
      }
  
      });
    });
  