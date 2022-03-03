define(
function() {
    'use strict';
    return {
        events : {
                bannerButtonClick: {
                    eventName: "banner_button_click",
                    eventCategory: "Video Show Case",
                    eventAction: "Banner Button"
                },
                bandClick: {
                    eventName: "band_click",
                    eventCategory: "Video Show Case",
                    eventAction: "Band Click"
                },
                thumbnailClick: {
                    eventName: "thumbnail_click",
                    eventCategory: "Video Show Case",
                    eventAction: "Thumbnail Click"
                },
                genreSelection: {
                    eventName: "genre_selection",
                    eventCategory: "Video Show Case",
                    eventAction: "Genre Change"
                },
                mastHeadClick: {
                    eventName: "banner_click",
                    eventCategory: "Premium Content / Promotion",
                    eventAction: "Banner Click"
                },
                addToWatchListInBanner: {
                    eventName: "add_to_watchlist_promotion",
                    eventCategory: "Premium Content / Promotion",
                    eventAction: "Add To WatchList"
                },
                addToWatchList: {
                    eventName: "add_to_watchlist",
                    eventCategory: "Video Events",
                    eventAction: "Watch Later"
                },
                getPremiumClick: {
                    eventName: "get_premium_click",
                    eventCategory: "Premium Content / Promotion",
                    eventAction: "Get Premium Account"
                },
                knowMoreClick: {
                    eventName: "know_more_click",
                    eventCategory: "Know More Button Click",
                    eventAction: "Know More Click"
                },                
                signInClick: {
                    eventName: "subscription_sign_in_click",
                    eventCategory: "Subscription",
                    eventAction: "Sign In"
                },
                signInFromMenu: {
                    eventName: "hamburger_sign_in",
                    eventCategory: "Sign In",
                    eventAction: "Sign In"
                },
                signInSuccess: {
                    eventName: "sign_in_success",
                    eventCategory: "Sign In",
                    eventAction: "Sign In - Success"
                },
                signOutClick: {
                    eventName: "sign_out",
                    eventCategory: "Sign Out",
                    eventAction: "Sign Out Proceed"
                },
                proceedSubscriptionClick: {
                    eventName: "subscription_proceed_click",
                    eventCategory: "Subscription",
                    eventAction: "Proceed"
                },
                couponCodeClick: {
                    eventName: "subscription_coupon_code_select",
                    eventCategory: "Subscription",
                    eventAction: "Use Coupon Code"
                },
                paymentMethodSelect: {
                    eventName: "subscription_payment_method_select",
                    eventCategory: "Subscription",
                    eventAction: "Payment Method"
                },
                subscriptionSuccess: {
                    eventName: "subscription_success",
                    eventCategory: "Subscription",
                    eventAction: "Success"
                },
                subscriptionError: {
                    eventName: "subscription_error",
                    eventCategory: "Subscription",
                    eventAction: "Error"
                },
                livItUpClick: {
                    eventName: "subscription_liv_it_up_click",
                    eventCategory: "Subscription",
                    eventAction: "LIV It Up Click"
                },                
                myPurchaseClick: {
                    eventName: "my_purchase_click",
                    eventCategory: "Subscription",
                    eventAction: "My Purchase Click"
                },
                upgradeSubscriptionClick: {
                    eventName: "active_subscription_action",
                    eventCategory: "Subscription",
                    eventAction: "Active Subscription Action"
                },           
                deviceManagementproceedClick: {
                    eventName: "device_management_proceed_click",
                    eventCategory: "Device Management",
                    eventAction: "Device Management Proceed Click"
                },
                deviceManagementError: {
                    eventName: "device_management_error",
                    eventCategory: "Device Management",
                    eventAction: "Device Management Error"
                }
            },
        pageNames: {
            home: 'Home Screen',
            settings: 'Settings Screen',
            mylist: 'My List Screen',
            moreMenu: 'Hamburger Menu Screen',
            account : 'Accounts Screen',
            subscription: 'Subscription Screen',
            subscriptionPayment: 'Subscription Payment Screen',
            detail: 'Detail Screen',
            subscriptionCouponCode: 'Coupon Code Screen',
            signUpSignIn:'Sign Up Screen /Email Sign In Screen',
            subscriptionSuccess: 'Subscription Payment Success Screen',
            subscriptionFailure: 'Subscription Payment Failured Screen',
            search: 'Search Screen',
            splash: 'Splash Screen',
            purchase: 'My Purchase Screen'
        }
    }
});