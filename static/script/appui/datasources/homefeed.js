define("app/appui/datasources/homefeed", [
    "antie/class", "app/appui/globals",
], function (Class, Globals) {
    return Class.extend({
        init: function (feed, callback) { // this.globals = new Globals();
            this.data = feed;
            this.returnCallback = callback;
            this.processCallback = null;
            this.globals = new Globals();
            this.itemsList = [];
            this.recommendationDetails = {
                isPresent: false,
                details: []
            };
            this.homeItemsRefreshArray = [];
            self = this;
        },

        loadData: function (callback) {
            this.processCallback = callback;
            this.homeItemsRefreshArray = [];
            let self = this;
            let iterationComplete = false;
            function processItem(index) {
                let item = self.data.items[index];
                
                if (item && item.items && item.items != null && item.items.length) {  
                    item["from"] = 0;
                    item["to"] = item.items.length - 1;
                    self.itemsList[index] = item;
                }
            }
            for (var i = 0; i < self.data.items.length; i++) {
                processItem(i);
            }
            iterationComplete = true;
            return self.invokeCallback();
        },
        invokeCallback: function () {
            let result = this.itemsList.filter(function (el) {
                return el.entity_type != "carousel";
            });
            result = this.filterItemsWithExistingLayouts(result);
            this.returnCallback(this.homeItemsRefreshArray);
            this.processCallback.onSuccess(result);
        },
        filterItemsWithExistingLayouts: function (items) {
            // var value = this.filterLayoutsThatExists(items);
            var value = items;
            for (var i = 0; i < value.length; i++) {
                if (value[i].data && value[i].items.length) {
                    this.homeItemsRefreshArray[i] = value[i].carousel_type;
                }
            }
            return value;
        },
        filterLayoutsThatExists: function (array) {
            return array.filter(item => {
                if (item && item.layout) {
                    return this.globals.API_CONSTANTS.CAROUSEL_LAYOUT_ARRAY.indexOf(item.layout) > -1;
                }
            });
        },
    });
});
