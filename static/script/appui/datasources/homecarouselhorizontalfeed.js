define(
    "app/appui/datasources/homecarouselhorizontalfeed",
    [
      "antie/class",
      'app/appui/globals',
    ],
    function (Class, Globals) {
      return Class.extend({
  
        init: function (feed) {
          this.data = feed;
          if (this.data.items && this.data.items.length) {
            for (var i = 0; i < this.data.items.length; i++) {
                this.data.items[i]['content_position'] = i + 1;
                this.data['total'] =  30;
            }
          }
        },
  
        loadData: function (callback) {
          if(this.data){
            var response = this.data;
            var layout = response.carousel_type ? response.carousel_type : response.entity_type ? response.entity_type :
            response.playlist_type ? response.playlist_type : null;
              var feedData = this.data.items.filter(function (el) {
                  el['card_type_id']= response.card_type_id
                  el['layout']= layout
                  return el != null;
              });
          }
          callback.onSuccess(feedData);
      }
  
      });
    });
  