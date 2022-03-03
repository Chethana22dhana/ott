var antie = { // eslint-disable-line no-unused-vars
  framework: {
    deviceConfiguration: {
      'pageStrategy': 'samsungmaple',
      'modules': {
        'base': 'logituit/devices/tizendevice',
        'modifiers': [
          'antie/devices/anim/css3transform', 
          'antie/devices/broadcastsource/samsungtvsource',
          'antie/devices/logging/onscreen', 
          'antie/devices/logging/default',
          'antie/devices/logging/xhr',
          'antie/devices/exit/samsung_tizen',
          'antie/devices/parentalguidance/appdefaultpghandler',
          'antie/devices/data/nativejson', 'antie/devices/data/json2',
          'antie/devices/storage/cookie'
        ]
      },
      'logging': {
        'level': 'error',
        'strategy': 'default'
      },
      'drm': {
        'vod': {
          'media': 'mss',
          'type': 'playready'
        },
        'live': {
          'media': 'mss',
          'type': 'playready'
        }
      },
      'streaming': {
        'video': {
          'mediaURIFormat': '%href%',
          'supported': [
            {
              'protocols': [
                'http'
              ],
              'encodings': [
                'h264'
              ],
              'transferFormat': [
                'hls', 'plain'
              ],
              'maximumVideoLines': 1080
            }
          ]
        },
        'audio': {
          'mediaURIFormat': '%href%',
          'supported': [
            {
              'protocols': [
                'http'
              ],
              'encodings': [
                'aac'
              ],
              'maximumBitRate': 192
            }
          ]
        }
      },
      'input': {
        'map': {
          '38': 'UP',
          '40': 'DOWN',
          '37': 'LEFT',
          '39': 'RIGHT',
          '13': 'ENTER',
          '415': 'PLAY',
          '19': 'PAUSE',
          '10252': 'PLAY_PAUSE',
          '413': 'STOP',
          '417': 'FAST_FWD',
          '412': 'REWIND',
          '49': '1',
          '50': '2',
          '51': '3',
          '52': '4',
          '53': '5',
          '54': '6',
          '55': '7',
          '56': '8',
          '57': '9',
          '48': '0',
          '10009': 'BACK',
          '10221': 'SUBTITLE',
          '457': 'INFO',
          '403': 'RED',
          '404': 'GREEN',
          '405': 'YELLOW',
          '406': 'BLUE',
          '10233': 'NEXT',
          '10232': 'PREV',
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
          "81": "Q",
          "82": "R",
          "83": "S",
          "84": "T",
          "85": "U",
          "86": "V",
          "87": "W",
          "88": "X",
          "89": "Y",
          "90": "Z",
          "32": "SPACE",
          "20": "CAPS_LOCK",
          "8": "BACK_SPACE"
        }
      },
      'accessibility': {
        'captions': {
          'supported': [
            'application/ttaf+xml'
          ]
        }
      },
      'layouts': [
        {
          'width': 1280,
          'height': 720,
          'module': 'app/appui/layouts/720p',
          'classes': [
            'browserdevice720p'
          ]
        }, {
          'width': 1920,
          'height': 1080,
          'module': 'app/appui/layouts/1080p',
          'classes': [
            'browserdevice1080p'
          ]
        }
      ],
      'networking': {
        'supportsJSONP': true,
        'supportsCORS': true
      },
      'broadcast': {
        'aitProfile': 'dtg_local',
        'currentChannelValidation': {
          'enabled': true
        }
      },
      'capabilities': [
        'dial_capable', 'uhd'
      ],
      'statLabels': {
        'deviceType': 'smarttv',
        'serviceType': 'retail',
        'osType': 'tizen',
        'browserType': 'tizen'
      }
    }

  }
}
