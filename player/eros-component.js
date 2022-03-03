var erosPlayer;
window.playersrc ="";
window.isLiveTV = false;
var service=new serviceFactory()
function InitPlayer(me, isHls,contentType,self) {
   var isEncrypted;
   var license;
    if (erosPlayer) {
      erosPlayer.destoryPlayer();
     
    }

    service.getplayermetadata().then(function(data){
       console.log(data)
      erosPlayer = new LogixPlayerComponent();
      
      if (erosPlayer) {
        try {
            jsonData.TVjson[5].text = self.asset_subtext;
            erosPlayer.createPlayer(jsonData);
            var url;
            isLive=false;
           
            
            if(contentType=='live')
            {
              isLive=true;
              window.isLiveTV = true;
              url = "https://content.uplynk.com/channel/5357e118878a4a4db12d8f1b042cad63.m3u8"; 
              window.playersrc=url;
              isEncrypted= false;
              license=""
        
            }
            else if(contentType=='vod'){
              url = self.url;
              window.playersrc=url;
              isEncrypted= false;
              license=""
            }
            else{
               url = "https://content.uplynk.com/8c827ff8ae2d4c42bf1fb241fc3da609.mpd?drm_policy_name=TEST001";
               window.playersrc=url;
               license="https://content.uplynk.com/pr"
              isEncrypted= true;
              
            }
      
              this.playbackData = {
               autoplay: true,
                videoUrl: url, //Mandatory
                type: 'application/x-mpegURL', //Optional
                licenseUrl:license, //Mandatory if it is a DRM content, application must pass this url
                certificateUrl: "", //Mandatory if it is a DRM content
                playerControlsLayout: jsonData,
                startTime: 0, //Mandatory if it is continue watch true
                subtitles: [
                  {
                      subtitleId: 1,
                      language: "",
                      subtitleUrl: "",
                      kind: 'captions'
                  },
                  {
                      subtitleId: 2,
                      kind: 'captions',
                      subtitleUrl: '',
                      languageCode: 'eng',
                      language: 'English'
                  },
                  {
                      subtitleId: 3,
                      kind: 'captions',
                      languageCode: 'ara',
                      subtitleUrl: "",
                      language: "Arabic"
                  },
                  {
                      subtitleId: 4,
                      kind: 'captions',
                      languageCode: '',
                      subtitleUrl: "",
                      language: ""
                  },
                  {
                      subtitleId: 5,
                      kind: 'captions',
                      languageCode: '',
                      subtitleUrl: "",
                      language: ""
                  },
                  {
                      subtitleId: 6,
                      kind: 'captions',
                      languageCode: '',
                      subtitleUrl: "",
                      language: ""
                  },
              ],
      
              };
  
              this.assetMetaData = {
               isLive:isLive, //Mandatory is content VOD or LIVE
                isEncrypted:isEncrypted, //Mandatory is content DRM or NON-DRM
                contentTitle: self.asset_title,
                isContinueWatch: false, //Mandatory
                thumbnailUrl: "https://images004-a.erosnow.com/movie/3/1000633/img7241/6825491/1000633_6825491_83.vtt",
                watermarkUrl: '',
                controlsDisappearTimerValuetv:5,
                audioLanguages: [
                  {
                    playback_al_id: 1,
                    playback_al_title: "hindi"
                  },
                  {
                    playback_al_id: 2,
                    playback_al_title: "English"
                  },
                  {
                    playback_al_id: 3,
                    playback_al_title: "Urdu"
                  },
                  {
                    playback_al_id: 4,
                    playback_al_title: "Telagu"
                  },
                  {
                    playback_al_id: 5,
                    playback_al_title: "Tamil"
                  },
                  {
                    playback_al_id: 6,
                    playback_al_title: "Polish"
                  },
                ],
                
              };
  
  
              this.TvplayerConfig = {
                videoQualitySettings: [ // as per the confluence page
                  {
                    playback_ql_bitrate: 2500,
                    playback_ql_id: 1, playback_ql_render_title: "360p",
                    playback_ql_checked: true,
                    playback_ql_subtitle: "",
                    playback_ql_title: "Auto"
                  },
                  {
                    playback_ql_bitrate: 2500,
                    playback_ql_id: 4,
                    playback_ql_render_title: "360p",
                    playback_ql_subtitle: "Uses about 1.3GB per hour",
                    playback_ql_title: "Best"
                  },
                  {
                    playback_ql_bitrate: 1500,
                    playback_ql_id: 3,
                    playback_ql_render_title: "252p",
                    playback_ql_subtitle: "Uses about 0.9GB per hour",
                    playback_ql_title: "High"
                  },
                  {
                    playback_ql_bitrate: 700,
                    playback_ql_id: 2,
                    playback_ql_render_title: "144p",
                    playback_ql_subtitle: "Uses about 0.4GB per hour",
                    playback_ql_title: "Medium"
                  },
                  {
                    playback_ql_bitrate: 400,
                    playback_ql_id: 2,
                    playback_ql_render_title: "144p",
                    playback_ql_subtitle: "Uses about 0.2GB per hour",
                    playback_ql_title: "Low"
                  },
                ],
                defaultVideoQualityBitrate: 1000,
                forwardRewindTime: 10,
                controlsDisappearTimerValue: 3,
                service:service
              };
              this.playbackData.subtitles= createSubtitleArray(data);
              this.playbackData.marker= data.marker
              data.next_contenturl="https://trailershls-a.erosnow.com/hls/movie/4/1023354/trailer/6374940/1023354_6374940_IPAD_ALL_multi.m3u8"
              this.playbackData.nextContent=data.next_content;
              this.playbackData.nextContenturl=data.next_contenturl;


              var playerBuilderRef = new playerBuilder();
              playerBuilderRef.setPlaybackData(this.playbackData);
              playerBuilderRef.setAssetMetaData(this.assetMetaData);
              playerBuilderRef.setPlayerConfig(this.TvplayerConfig);
              erosPlayer.initializePlayer("erosPlayer", playerBuilderRef)
                .then(function (playerobj) {
                  console.log("player is iniatlized.....******************", playerobj);
                  this.player = playerobj;
                  var me = this;
                  registerCustomEvents(playerobj);
                });
   //           });
        }
        catch (exception) {
          console.error("error", exception);
        }
      }

    }, function (error) {

      console.log("API is fails with error", error);

    });

   
  }
  function createSubtitleArray(data){
         var subtitlearr=[];
         var subtitledata=data.subtitles;
         for(i=0;i<subtitledata.length;i++){
            var item={};
            item.kind="captions"
            item.subtitleUrl=subtitledata[i].subtitle_url;
            item.languageCode=subtitledata[i].language_code;
            item.language=subtitledata[i].language_name;
            subtitlearr.push(item);
         }
         return subtitlearr;
         
  }
  function destoryPlayer(){
    if (erosPlayer) {
    erosPlayer.destoryPlayer();
    }
    erosPlayer=null;
    document.getElementsByClassName('container')[0].style.display="block";
  }

function registerCustomEvents(playerObj) {
  playerObj.eventEmitter.addEventListener("onProgress", function (e) { console.log("playerProgressEvent", e.detail.event) });
  playerObj.eventEmitter.addEventListener("onPlaying", function (e) { console.log("playingEvent", e.detail.event) });
  playerObj.eventEmitter.addEventListener("onfullscreenChange", function (e) {
      //  console.log("onfullscreenChangeEvent") ;
      console.log("onfullscreenChangeEvent", window.screen.orientation.type);


  });
  playerObj.eventEmitter.addEventListener("onAdstart", function (e) { console.log("onAdstartEvent") });
  playerObj.eventEmitter.addEventListener("onAdEnd", function (e) { console.log("onAdEndEvent") });
  playerObj.eventEmitter.addEventListener("onAdskip", function (e) { console.log("onAdskipEvent") });
  playerObj.eventEmitter.addEventListener("onError", function (e) { console.log("onErrorEvent") });
  playerObj.eventEmitter.addEventListener("onloadeddata", function (e) { console.log("onloadeddataEvent") });
  playerObj.eventEmitter.addEventListener("onloadedmetadata", function (e) {
      console.log("onloadedmetadataEvent")
  });
  playerObj.eventEmitter.addEventListener("onended", function (e) {
      console.log("onendedEvent");
  });
  playerObj.eventEmitter.addEventListener("onloadstart", function (e) { console.log("onloadstartEvent") });
  playerObj.eventEmitter.addEventListener("onPlay", function (e) {
      console.log("onPlayEvent", e)
  });
  playerObj.eventEmitter.addEventListener("onPause", function (e) {
      console.log("onPausesEvent", e)
  });
  playerObj.eventEmitter.addEventListener("onTimeUpdate", function (e) {
      console.log("onTimeUpdateEvent", e)
  });
  playerObj.eventEmitter.addEventListener("onAdProgress", function (e) { console.log("onAdProgressEvent") });
  playerObj.eventEmitter.addEventListener("onPlayerReady", function (e) { console.log("onPlayerReadyEvent") });
  playerObj.eventEmitter.addEventListener("onrateChange", function (e) { console.log("onrateChangeEvent") });
  playerObj.eventEmitter.addEventListener("onSuspend", function (e) { console.log("onsuspendEvent") });
  playerObj.eventEmitter.addEventListener("onStalled", function (e) { console.log("onStalledEvent") });
  playerObj.eventEmitter.addEventListener("onSeeked", function (e) { console.log("onseekedEvent") });
  playerObj.eventEmitter.addEventListener("onSeeking", function (e) { console.log("onseekingEvent") });
  playerObj.eventEmitter.addEventListener("onVolumechange", function (e) { console.log("onvolumechangeEvent") });
  playerObj.eventEmitter.addEventListener("onResolutionChange", function (e) { console.log("onResolutionChangeEvent") });
  playerObj.eventEmitter.addEventListener("onPlayerReady", function (e) { console.log("onPlayerReadyEvent") });
  playerObj.eventEmitter.addEventListener("onabort", function (e) { console.log("onabortevent") });
  playerObj.eventEmitter.addEventListener("onfirstPlay", function (e) { console.log("onfirstPlayEvent") });
  playerObj.eventEmitter.addEventListener("onClose", function (e) { 
      console.log("onClose");
      // this.logixPlayer.destoryPlayer();
      me.destoryPlayer(logixPlayer);
  });

}

function handleTVControlEvents(events){
   if (erosPlayer)
   erosPlayer.handleTVControlEvents(events);

}
document.addEventListener("keydown",function(e){
   handleTVControlEvents(e)
})

function isPlayerOn(){
  if(erosPlayer)
  return true;
  return false;
}
//console.log=function(){};

var jsonData ={
  "TVjson":[
   {
      "control":"upnexttv",
      "active":true,
      "styleCSS":{
         "style":[
            {
               "top":"50.6%;"
            },
            {
               "position":"absolute;"
            },
            {
               "left":"76.7%;"
            },
            {
               "height":"40.2%;"
            },
            {
               "outline":"none;"
            },
            {
               "width":"18.1%;"
            },
            {
               "right":"15rem;"
            },
            {
               "z-index":"1;"
            },
            {
               "display":"none;"
            },
          
            {
               "transform":"rotate(0deg);"
            },
            {
               "background-color":"#171f2c;"
            },
            {
               "cursor":"pointer;"
            },
            {
               "position":"absolute;"
            },
            {
               "background-repeat":"no-repeat;"
            },
            {
               " background-position":"center;"
            },
           
         ]
      },
      "text":"",
      "icon":"imagpath",
      "hovertext":""
   },

   {
      "control":"recommended_tv",
      "active":true,
      "styleCSS":{
         "style":[
           
            {
               "position":"absolute;"
            },
          
            {
               "height":"100% !important;"
            },
            
            {
               "width":"100%;"
            },
           
            {
               "z-index":"1;"
            },
            {
               "display":"block;"
            },
           
         ]
      },
      "text":"",
      "icon":"imagpath",
      "hovertext":""
   },
     {
      "control":"live_buttonTv",
      "active":true,
      "styleCSS":{
         "style":[
            {
               "position":"absolute;"
            },
            {
               "outline":"none;"
            },
            {
               "left":"83.6%;"
            },
            {
               "height":"4.4%;"
            },
            {
               "width":"6.6%;"
            },
            {
               "display":"none;"
            },
            {
               "z-index":"1;"
            },
            {
               "top":"9.5%;"
            },
            {
               "cursor":"pointer;"
            },
            {
               "background-color": "#5cb617;"
            },
            {
               "color": "#ffffff;"
            },
            {
               "font-size": "36px;"
            },
            {
               "border-radius": "6px;"
            },
            {
               "font-stretch": "normal;"
            },
            {
               "font-style": "normal;"

            },
            {
               "letter-spacing": "normal;"
            }
         ]
      },
      "text":"LIVE",
      "icon":"imagpath",
      "hovertext":""
   },
  
   {
         "control":"nextEpisode_button",
         "active":true,
         "styleCSS":{
            "style":[
               {
                  "position":"absolute;"
               },
               {
                  "outline":"none;"
               },
               {
                  "font-weight":"bold;"
               },
               {
                  "left":"5.2%;"
               },
               {
                  "height":"4.3%;"
               },
               {
                  "border-radius":"5px;"
               },
               {
                  "width":"13%;"
               },
               
               {
                  "background-repeat":"no-repeat;"
               },
               {
                  "display":"block;"
               },
               {
                  "z-index":"1;"
               },
               {
                  "top":"72.6%;"
               },
               // {
               //    "bottom":"33.1%;"
               // },
               {
                  "cursor":"pointer;"
               },
               {
                  "padding-left":"1%;"
               },
               
               {
                  "background-image":"url(player/assets/player_assets/ic-backbuttontv/ic_next.png);"
               },
               {
                  "color": "#ffffff;"
               },
               {
                  "font-size": "24px;"
               },
               // {
               //    "font-family": "ProximaNova-Semibold;"
               // },
               {
                  "font-stretch": "normal;"
               },
               {
                  "font-style": "normal;"
   
               },
               {
                  "letter-spacing": "normal;"
               },
               {
                  "background-size":"48px;"
               }
            ]
         },
         "text":"Next Episode",
         "icon":"imagpath",
         "hovertext":""
      },
      {
         "control":"setting_button",
         "active":true,
         "styleCSS":{
            "style":[
               {
                  "position":"absolute;"
               },
               {
                  "outline":"none;"
               },
               {
                  "font-weight":"bold;"
               },
               {
                  "left":"5.2%;"
               },
               {
                  "height":"4.3%;"
               },
               {
                  "border-radius":"5px;"
               },
               {
                  "width":"9.5%;"
               },
               
               {
                  "background-repeat":"no-repeat;"
               },
               {
                  "display":"block;"
               },
               {
                  "z-index":"1;"
               },
               {
                  "top":"54.1%;"
               },
               // {
               //    "bottom":"42.1%;"
               // },
               {
                  "cursor":"pointer;"
               },
               {
                  "padding-left":"1.5%;"
               },
               
               {
                  "background-image":"url(player/assets/player_assets/ic-backbuttontv/ic_settings.png);"
               },
               {
                  "color": "#ffffff;"
               },
               {
                  "font-size": "24px;"
               },
               // {
               //    "font-family": "ProximaNova-Semibold;"
               // },
               {
                  "font-stretch": "normal;"
               },
               {
                  "font-style": "normal;"
   
               },
               {
                  "letter-spacing": "normal;"
               },
               {
                  "background-size":"48px;"
               }
            ]
         },
         "text":"Settings",
         "icon":"imagpath",
         "hovertext":""
      },

      {
         "control":"videosubtitle",
         "active":true,
         "styleCSS":{
            "style":[
               {
                  "position":"absolute;"
               },
               {
                  "outline":"none;"
               },
               {
                  "left":"4.4%;"
               },
               {
                  "height":"4.4%;"
               },
               {
                  "width":"32.3%;"
               },
               {
                  "display":"block;"
               },
               {
                  "z-index":"1;"
               },
               {
                  "top":"23.2%;"
               },
               {
                  "opacity":"0.7;"
               },
               {
                  "color": "#ffffff;"
               },
               {
                  "font-size": "1.667vw;"
               },
              
              
            ]
         },
         "text":"S2 E1: Asguard’s Vengeance Into The Dark",
         "icon":"imagpath",
         "hovertext":""
      },

      {
         "control":"subtitle",
         "active":true,
         "styleCSS":{
            "style":[
               {
                  "position":"absolute;"
               },
               {
                  "font-weight":"bold;"
               },
               {
                  "outline":"none;"
               },
               {
                  "left":"5.1%;"
               },
               {
                  "height":"6.7%;"
               },
               {
                  "border-radius":"5px;"
               },
               {
                  "width":"16%;"
               },
               
               {
                  "background-repeat":"no-repeat;"
               },
               // {
               //    "display":"block;"
               // },
               {
                  "z-index":"1;"
               },
               {
                  "top":"62.6%;"
               },
               {
                  "padding-bottom":"0.5%;"
               },
               {
                  "padding-top":"0.6%;"
               },
               {
                  "cursor":"pointer;"
               },
               {
                  "padding-left":"0.1%;"
               },

               {
                  "background-position":"left;"
               },
               
               {
                  "background-image":"url(player/assets/player_assets/ic-backbuttontv/icon_subtitles.png);"
               },
               {
                  "color": "#ffffff;"
               },
               {
                  "font-size": "23px;"
               },
               // {
               //    "font-family": "ProximaNova-Semibold;"
               // },
               {
                  "border-radius": "2px;"
               },
               {
                  "font-stretch": "normal;"
               },
               {
                  "font-style": "normal;"
   
               },
               {
                  "letter-spacing": "normal;"
               },
               {
                  "background-size": "50px;"
               }
            ]
         },
         "text":"Audio & Subtitles",
         "icon":"imagpath",
         "hovertext":""
      },
   
      {
         "control":"skipintro_button",
         "active":true,
         "styleCSS":{
            "style":[
               {
                  "position":"absolute;"
               },
              
               {
                  "left":"79.9%;"
               },
               {
                  "height":"6.7%;"
               },
              
               {
                  "width":"14.8%;"
               },
               
               {
                  "display":"none;"
               },
               {
                  "z-index":"1;"
               },
               {
                  "top":"84.1%;"
               },
               {
                  "background-color":"#ffffff;"
               },
               {
                  "color":"#0d1118;"
               },
               {
                  "border-radius":"4px;"
               },
               {
                  "cursor":"pointer;"
               },
               {
                  "font-size": "1.66vw;"
               },
               {
                  "font-family": "ProximaNova-Semibold;"
               },
             
              
            ]
         },
         "text":"Skip Intro",
         "icon":"imagpath",
         "hovertext":""
      },
     {
      "control":"title",
      "active":true,
      "styleCSS":{
         "style":[
            {
               "top":"17.4%;"
            },
            {
               "font-weight":"bold;"
            },
            {
               "outline":"none;"
            },
            {
               "position":"absolute;"
            },
            {
               "left":"5.2%;"
            },
            {
               "font-size":"40px;"
            },
            // {
            //    "font-family":" ProximaNova-Bold;"
            // },
            {
               "font-stretch":"normal;"
            },
            {
               "font-style":"normal;"
            },
            {
               "line-height":"normal;"
            },
            {
               "letter-spacing":"normal;"
            },
            {
               "color":"#ffffff;"
            }
         ]
      },
      "text":"Thor: The Dark World",
      "icon":"imagpath",
      "hovertext":""
   },
    
     {
        "control":"seekbar",
        "active":true,
        "styleCSS":{
           "style":[
              {
                 "top":"87.6%;"
              },
              {
                 "pointer-events":"auto;"
              },
              {
                 "outline":"none;"
              },
              {
                 "width":"72.1%;"
              },
              {
                 "position":"absolute;"
              },
              {
                 "left":"9.8%;"
              },
              {
                 "height":"1.2% !importent;"
              },
              {
                 "outline":"none"
              },
              {
                 "right":"13%;"
              },
              {
                 "z-index":"2!important; "
              },
              {
                 "font-size":"25px;"
              }
           ]
        },
        "text":"",
        "icon":"imagpath",
        "hovertext":""
     },
    
     {
        "control":"play_pause",
        "active":true,
        "styleCSS":{
           "style":[
              {
                 "top":"85.8%;"
              },
              {
                 "position":"absolute;"
              },
              {
                 "outline":"none;"
              },
              {
                 "left":"5.2%;"
              },
              {
                 "height":"5.4%;"
              },
              {
                 "width":"3%;"
              },
              {
                 "display":"block;"
              },
              {
                 "transform":"rotate(0deg);"
              },
              {
                 "transform":"transform 500ms linear;"
              },
              {
                 "z-index":"1;"
              },
              {
                 "cursor":"pointer;"
              },
              {
                 "background-repeat":"no-repeat;"
              },
              {
                 "background-position":"center;"
              },
              {
                 "background-image":"url(player/assets/player_assets/ic-backbuttontv/ic_play.png);"
              },
              {
                 "border-radius":"50px;"
              }
           ]
        },
        "text":"",
        "icon":"imagpath",
        "hovertext":""
     },
    
     {
        "control":"videoQuality",
        "active":true,
        "styleCSS":{
           "style":[
              {
                 "top":"88%;"
              },
              {
                 "position":"absolute;"
              },
              {
                 "outline":"none;"
              },
              {
                 "left":"81%;"
              },
              {
                 "height":"10%;"
              },
              {
                 "width":"10%;"
              },
              {
                 "display":"none;"
              },
              {
                 "transform":"rotate(0deg);"
              },
              {
                 "transform":"transform 500ms linear;"
              },
              {
                 "z-index":"1;"
              },
              {
                 "cursor":"pointer;"
              },
              {
                 "right":"24rem;"
              },
              {
                 "bottom":"45%;"
              },
              {
                 "width":"6em;"
              },
              {
                 "right":" 1rem;"
              },
              {
                 "cursor":"pointer;"
              },
              {
                 "background-repeat":"no-repeat;"
              },
              {
                 "background-position":"center;"
              },
              {
                 "background-image":"url(UIComponent/Component/assets/LogiPlayer_icons/ic-settings/ic-settings.png);"
              }
           ]
        },
        "text":"",
        "icon":"imagpath",
        "hovertext":""
     },
     
     
     {
        "control":"backbutton",
        "active":true,
        "styleCSS":{
           "style":[
              {
                 "top":"9.3%;"
              },
              {
                 "position":"absolute;"
              },
              {
                 "outline":"none;"
              },
              {
                 "left":"5.2%;"
              },
              {
                 "height":"4.6%;"
              },
              {
                 "width":"2.8%;"
              },
              {
                 "display":"block;"
              },
              {
                 "transform":"rotate(0deg);"
              },
              {
                 "transform":"transform 500ms linear;"
              },
              {
                 "z-index":"1;"
              },
              {
                 "cursor":"pointer;"
              },
              {
                 "right":"24rem;"
              },
              {
                 "bottom":"45%;"
              },
            
              {
                 "cursor":"pointer;"
              },
              {
                 "background-repeat":"no-repeat;"
              },
              {
                 "background-position":"center;"
              },
              {
                 "background-image":"url(player/assets/player_assets/ic-backbuttontv/ic_back.png);"
              }
           ]
        },
        "text":"",
        "icon":"imagpath",
        "hovertext":""
     },
     {
        "control":"videotitle",
        "active":true,
        "styleCSS":{
           "style":[
              {
                 "top":"17.4%;"
              },
              {
                 "font-size":"1.56vw;"
              },
              {
                 "position":"absolute;"
              },
              {
                 "outline":"none;"
              },
              {
                 "left":"5.2%;"
              },
              {
                 "height":"10%;"
              },
              {
                 "width":"20%;"
              },
              {
                 "display":"block;"
              },
              {
                 "transform":"rotate(0deg);"
              },
              {
                 "transform":"transform 500ms linear;"
              },
              {
                 "z-index":"1;"
              },
              {
                 "cursor":"pointer;"
              },
              {
                 "right":"24rem;"
              },
              {
                 "bottom":"45%;"
              },
              {
                 "width":"6em;"
              },
              {
                 "right":" 1rem;"
              },
              {
                 "cursor":"pointer;"
              },
              {
                 "background-repeat":"no-repeat;"
              },
              {
                 "background-position":"center;"
              },
              {
                 "font-family":"ProximaNova-Bold"
              }
           ]
        },
        "text":"",
        "icon":"imagpath",
        "hovertext":""
     },
     {
        "control":"duration",
        "active":true,
        "styleCSS":{
           "style":[
              {
                 "display":"block;"
              },
              {
                 "top":"87%;"
              },
              {
                 "left":"90%;"
              },
              {
                 "position":"absolute;"
              },
              {
                  "opacity":"0.5;"
              },
              {
                 "font-size":"24px;"
              },
              {
                 "font-family":"ProximaNova-Semibold"
              }
           ]
        },
        "text":"",
        "icon":"imagpath",
        "hovertext":""
     },
     {
        "control":"timeDivider",
        "active":true,
        "styleCSS":{
           "style":[
              {
                 "display":"block;"
              },
              {
                 "top":"87%;"
              },
              {
                 "left":"89.3%;"
              },
              {
                 "position":"absolute;"
              },
              {
                 "font-size":"24px;"
              },
              {
                 "opacity":"0.5"
              }
           ]
        },
        "text":"",
        "icon":"imagpath",
        "hovertext":""
     },
     {
        "control":"waterMark",
        "active":true,
        "styleCSS":{
           "style":[
              {
                 "top":"9.3%;"
              },
              {
                 "position":"absolute;"
              },
              {
                 "right":"3.2%;"
              },
              {
                 "height":"10%;"
              },
              {
                 "outline":"none;"
              },
              {
                 "width":"22%;"
              },
              {
                 "z-index":"1;"
              },
              {
                 "display":"none;"
              },
              {
                 "transform":"rotate(0deg);"
              },
              {
                 "transition":"transform 500ms linear;"
              },
              {
                 "cursor":"pointer;"
              },
              {
                 "background-repeat":"no-repeat;"
              },
              {
                 " background-position":"center;"
              },
              {
                 " background-image":"url(player/assets/player_assets/ic-backbuttontv/en_logo_overlay.png);"
              }
           ]
        },
        "text":"",
        "icon":"imagpath",
        "hovertext":""
     },
     {
        "control":"currentTime",
        "active":true,
        "styleCSS":{
           "style":[
              {
                 "display":"block;"
              },
              {
                 "top":"87%;"
              },
              {
                 "left":"86.6%;"
              },
              {
                 "position":"absolute;"
              },
              {
                 "font-size":"24px;"
              },
              {
               "font-family":"ProximaNova-Semibold;"
              }
           ]
        },
        "text":"",
        "icon":"imagpath",
        "hovertext":""
     },
    
  ]
}