define("app/appui/datasources/menufeed", ["antie/class"], function (Class) {
  return Class.extend({
    init: function (feed) {
      // this.globals = new Globals();
      this.data = feed;
    },

    // You will probably want to do something more useful then returning static data
    loadMenu: function (callbacks) {
      if (this.data) {
        let search = {title :'Search',page_id:0};
        this.data.unshift(search);
        let user = {title : 'Account', page_id: 8};
        this.data.push(user);
        var feedData = this.data.filter(function (el) {
          return el != null;
        });
      }
      callbacks.onSuccess(feedData);
    },
  });
});
