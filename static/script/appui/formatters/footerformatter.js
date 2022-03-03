define(
    "app/appui/formatters/footerformatter",
    [
      "antie/formatter",
      "antie/widgets/label",
      "antie/widgets/button",
      "antie/widgets/image"
    ],
    function(Formatter, Label, Button, Image) {
      return Formatter.extend({
        format : function (iterator) {
          var button, item, image, title, button;
          item = iterator.next();
          button = new Button("fotter" + item.id);
          image=new Image("img-item.id", item.img)

          image.addClass("iconImg")
          button.appendChildWidget(image);

          title=new Label(item.label)
          title.addClass("iconLabel")
          button.appendChildWidget(title);
          button.setDataItem(item);
          
          button.addEventListener("select",function(e){
            e.preventDefault();
            e.stopPropagation()
          })

          return button;
          
        }
      });
    }
  );