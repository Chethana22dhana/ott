define(
  "app/appui/formatters/splashformatter",
  [
    "antie/formatter",
    "antie/widgets/image",
    "antie/widgets/container"
    
  ],
  function(Formatter, Image,Container) {
    return Formatter.extend({
      format : function (iterator) {
        var button, item;
        item = iterator.next();
        // button = new Button("homepage" + item.id);

        // button.addClass("iconButton")
        // image=new Image("img-item.id", item.img, { width : 50, height: 20})
        // image.addClass("iconImg")
        // button.appendChildWidget(image);

        var container=new Container("containerButton")
            container.addClass()
            var image = new Image("img-container", item.img, { width :50, height: 20})
            image.addClass("iconImg")
            container.appendChildWidget(image);

      //   title=new Label(item.title)
      //   title.addClass("iconLabel")
      //   button.appendChildWidget(title);
        
        return container;
        
      }
    });
  }
);

