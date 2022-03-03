/**
* This is the searchformatter.js page for ErosNow application.
* It is the formatter for the search page in the application
*/


// Including the required widgets
define('app/appui/formatters/searchcarouselhorizontalformatter', [
    'antie/formatter',
    'antie/widgets/label',
    'logituit/widgets/button',
    'antie/widgets/image',
    'app/appui/globals',
    'logituit/libs/util',
    'antie/widgets/container'
],
// Initiating the fuction with required parameters and global variable declaration
    function (Formatter, Label, Button, Image, Globals, Utils, Container) {
    return Formatter.extend({
        init: function () {
            self = this;
        },
        format: function (iterator) {
            var button,
                item,
                imgVal,
                img,
                globals,
                utils,imgContainer;
            self.globals = new Globals();
            self.utils = new Utils();
            item = iterator.next();
            console.log(item, "itemin formatter")
            button = new Button('item' + item.id);
            //     // Attaching premium,subscribed etc icons to the thumbnail based on user entitled value
            //     var icon_not_subscribed = Globals.IMAGE_CDN + ((item && item.metadata && item.metadata.emfAttributes && item.metadata.emfAttributes.icon_on_asset && item.metadata.emfAttributes.icon_on_asset.icon_not_subscribed) ? item.metadata.emfAttributes.icon_on_asset.icon_not_subscribed : globals.PREMIUM_ICON);
            //     var icon_subscribed = Globals.IMAGE_CDN + ((item && item.metadata && item.metadata.emfAttributes && item.metadata.emfAttributes.icon_on_asset && item.metadata.emfAttributes.icon_on_asset.icon_subscribed) ? item.metadata.emfAttributes.icon_on_asset.icon_subscribed : globals.PREMIUM_SUBSCRIBED);
            //     var premiumImage = new Image('premium-icon', icon_not_subscribed);
            //     var premiumSubscribed = new Image('premium-subscribed', icon_subscribed);
            //     if (
            //         item.metadata.emfAttributes &&
            // item.metadata.emfAttributes.value === globals.SUBSCRIPTION_MODE.SVOD
            //     ) {
            //         if (globals.getUserState() === globals.USER_STATE.SUBSCRIBED_USER) {
            //             let myPacks = JSON.parse(localStorage.getItem('package_list'));
            //             self.packOfCurrentAsset = item.metadata.emfAttributes.packageid;
            //             for (let i = 0; i < myPacks.length; i++) {
            //                 var isEntitled = false;
            //                 if (
            //                     myPacks.length &&
            //       self.packOfCurrentAsset &&
            //       self.packOfCurrentAsset.includes(myPacks[i])
            //                 ) {
            //                     isEntitled = true;
            //                     break;
            //                 }
            //             }
            //             if (isEntitled) {
            //                 premiumSubscribed.addClass('searchPremium');
            //                 button.appendChildWidget(premiumSubscribed);
            //             } else {
            //                 premiumImage.addClass('searchPremium');
            //                 button.appendChildWidget(premiumImage);
            //             }
            //         } else {
            //             premiumImage.addClass('searchPremium');
            //             button.appendChildWidget(premiumImage);
            //         }
            //     }
            console.log(item);

            // imgVal = (item.metadata.emfAttributes.portrait_thumb ? item.metadata.emfAttributes.portrait_thumb : item.metadata.emfAttributes.thumbnail);
            // imgVal = item.images[17] ? item.images[17] : item.images[48] ? item.images[48] : '';

            // var imgVal = item.images && item.images[8] ? item.images[8] : item.images && item.images[15] ? item.images[15] : item.images && item.images[16] ? item.images[16] : '';
            var imgVal = item.images && item.images[0] ? item.images[0].cdn_url : '';
            console.log('thumbnail img' + imgVal);
            img = self.utils.getCloudinaryUrl(self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.PORTRAIT_LAYOUT) + imgVal;
            imgContainer = new Button('imgcontainer' + item.asset_id);
            imgContainer.addClass('SearchAltImg')
            // console.log(img)
            imgContainer.appendChildWidget(new Image('img-item.id', img,));
            // imgContainer.appendChildWidget(new Label(item.layout));

            // debugger
            imgContainer.setDataItem(item);
            return imgContainer;
        }
    });
});
