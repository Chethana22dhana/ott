define(
    "app/appui/datasources/footerfeed",
    [
      "antie/class"
    ],
    function(Class) {
      return Class.extend({
        // You will probably want to do something more useful then returning static data
        loadData : function(callbacks) {
          callbacks.onSuccess(
            [
              {
                "id":"1",
                "img" : "",
                'label': 'Buy ₹ 99',

              },
              {
                "id":"2",
                "img" : "static/img/ic_trailer.svg",
                'label': 'Watch Trailer',
                
              },
              {
                "id":"3",
                "img" : "static/img/icons8-plus.svg",
                'label': 'WatchList',
                
              },
              {
                "id":"4",
                "img" : "static/img/ic_rate.svg",
                'label': 'Rate',
                
              },
              {
                "id":"5",
                "img" : "static/img/ic_more.svg",
                'label': 'More',
                
              },
            ]
            
        );
      }
   });
 });