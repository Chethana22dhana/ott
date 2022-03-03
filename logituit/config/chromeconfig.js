var antie = {
  // eslint-disable-line no-unused-vars
  framework: {
    deviceConfiguration: {
      pageStrategy: "html5hbbtvhybridappshow",
      modules: {
        base: "logituit/devices/chromedevice",
        modifiers: [
          "antie/devices/anim/css3",
          "antie/devices/broadcastsource/hbbtvsource",
          "antie/devices/data/nativejson",
          "antie/devices/storage/cookie",
          "antie/devices/logging/onscreen",
          "antie/devices/logging/default",
          'antie/devices/logging/xhr',
          "antie/devices/logging/jstestdriver",
          "antie/devices/exit/closewindow",
          "antie/devices/parentalguidance/appdefaultpghandler",
        ],
      },
      logging: {
        'level': 'error',
        'strategy': 'default'
      },
      drm: {
        vod: {
          media: "mss",
          type: "playready",
        },
        live: {
          media: "mss",
          type: "playready",
        },
      },
      streaming: {
        video: {
          mediaURIFormat: "%href%",
          supported: [
            {
              protocols: ["http"],
              encodings: ["h264"],
              transferFormat: ["dash", "hls", "plain"],
              maximumVideoLines: 1080,
            },
          ],
        },
        audio: {
          mediaURIFormat: "%href%",
          supported: [
            {
              protocols: ["http"],
              encodings: ["aac"],
              maximumBitRate: 192,
            },
          ],
        },
      },
      input: {
        map: {
          "38": "UP",
          "40": "DOWN",
          "37": "LEFT",
          "39": "RIGHT",
          "13": "ENTER",
          "415": "PLAY",
          "19": "PAUSE",
          // "413" : "STOP",
          "8": "BACK_SPACE",
          // "156" : "HELP",
          // "413" : "STOP",
          "81": "BACK",
          // "18" : "ALTERNATIVE DESCRIPTION",
         // "73": "INFO", // i
          //"82": "RED", // r
          //"71": "GREEN", // g
         // "66": "BLUE", // b
          // "1028" : "AUDIODESCRIPTION",
          // "460" : "SUBTITLE",
          "48": "0",
          "49": "1",
          "50": "2",
          "51": "3",
          "52": "4",
          "53": "5",
          "54": "6",
          "55": "7",
          "56": "8",
          "57": "9",
          "89": "Y",
          "65": "A",
          "66": "B",
          "67": "C",
          "68": "D",
          "69": "E",
          "70": "F",
          "71": "G",
          "72": "H",
          "73": "I",
          "74": "J",
          "75": "K",
          "76": "L",
          "77": "M",
          "78": "N",
          "79": "O",
          "80": "P",
          // "81": "Q",
          "82": "R",
          "83": "S",
          "84": "T",
          "85": "U",
          "86": "V",
          "87": "W",
          "88": "X",
          "90": "Z",
          "32": "SPACE",
          "20": "CAPS_LOCK"

        },
      },
      accessibility: {
        captions: {
          supported: ["application/ttaf+xml"],
        },
      },
      layouts: [
        {
          width: 1280,
          height: 720,
          module: "app/appui/layouts/720p",
          classes: ["browserdevice720p"],
        },
        {
          width: 1920,
          height: 1080,
          module: "app/appui/layouts/1080p",
          classes: ["browserdevice1080p"],
        },
      ],
      networking: {
        supportsJSONP: true,
        supportsCORS: true,
      },
      capabilities: ["dial_capable", "uhd"],
      broadcast: {
        aitProfile: "hbbtv_20",
      },
      statLabels: {
        deviceType: "smarttv",
        serviceType: "retail",
        osType: "Google Chrome",
        browserType: "chromium",
      },
    },
  },
};
