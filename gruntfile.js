var ranstring = require("randomstring");
var randnum = ranstring.generate();
module.exports = function (grunt) {
  'use strict'
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    randomString : randnum,
    appinfo: grunt.file.readJSON('appinfo.json'),
    date: grunt.template.today('yyyymmdd'),
    revision: grunt.option('revision'),
    salesChannel: grunt.option('sales_channel') || 'SAMSUNG_HTML_TV',
    platform:grunt.option('platform') || '',
    bumpfiles: 'appinfo.json config.xml orsay-config.xml package.appxmanifest static/script/appui/globals.js',
    clean: ['.buildResult', 'build', 'AppPackages', 'bld', 'BundleArtifacts', 'bin'],
    babel: {
      options: {
        sourceMap: false,
        presets: ['@babel/preset-env'],
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'build',
            src: ['static/script/appui/**/*.js','static/script-tests/**/*.js', 'logituit/**/*.js'],
            dest: 'build/'
          }
        ]
      }
    },
    eslint: {
      target: [
        'static/script/appui/**/*.js',
        'logituit/**/*.js',
        '!logituit/libs/*.js'
      ],
      options: {
        configFile: '.eslintrc.json',
        fix: false
      }
    },
    standard: {
      app: {
        src: [
          'static/script/appui/**/*.js',
          'logituit/**/*.js'
        ]
      },
      options: {
        ignore: [
          'logituit/libs/webOS.js',
          'logituit/libs/vttparser.js',
          'logituit/libs/pusher.js',
          'logituit/libs/md5.js'
        ],
        globals: [
          'define', 'require', 'localStorage', 'dstvNowDataLayer', 'analytics', '_satellite',
          'webapis', 'tizen', 'caph', 'webOS', 'LOCAL_HOST', 'XMLHttpRequest',
          'WebVTTParser', 'Windows'
        ],
        fix: false
      }

    },
    csslint: {
      strict: {
        options: {
          'important': false,
          'ids': false,
          'bulletproof-font-face': false,
          'compatible-vendor-prefixes': false,
          'fallback-colors': false,
          'adjoining-classes': false,
          'box-model': false,
          'box-sizing': false,
          'font-sizes': false,
          'floats': false,
          'duplicate-background-images': false
        },
        src: ['static/style/**/*.css']
      }
    },
    postcss: {
      options: {
        map: false,
        processors: [
          require('postcss-prettify')
        ]
      },
      dist: {
        src: ['static/style/**/*.css']
      }
    },
    jasmine: {
      Task1: {
        src: [
          'static/script-tests/**/*.js'
        ],
        options: {  
          specs: [
            'static/script-tests/**/*.js'
          ],
        },
      },      
      istanbul: {
        src: '<%= jasmine.Task1.src %>',
        options: {
            vendor: '<%= jasmine.Task1.options.vendor %>',
            specs: '<%= jasmine.options.specs %>',
            template: require('grunt-template-jasmine-istanbul'),
            templateOptions: {
                coverage: 'coverage/json/coverage.json',
                report: [
                    {type: 'html', options: {dir: 'coverage/html'}},
                    {type: 'text-summary'}
                ]
            }
        },
        vendor: [
          'static/script/appui/components/constant.js',
          // 'static/script-tests/lib/sinon.js',
          // 'static/script-tests/lib/require.js',
          // 'static/script-tests/lib/ondevicetestconfigvalidate.js',
          // 'static/script-tests/jasmine/jstestdriver-adapter.js',
          // 'static/script-tests/lib/mockapplication.js',
          // 'static/script-tests/lib/phantompolyfills.js',
          // 'static/script-tests/mocks/mockelement.js',
          // 'static/script-tests/tests/devices/mediaplayer/commontests.js',
          // 'static/script-tests/tests/devices/mediaplayer/html5commontests.js',
          // 'static/script-tests/tests/devices/mediaplayer/cehtmlcommontests.js'
        ],
        styles: [
          'static/script-tests/lib/carousels.css',
          'static/script-tests/lib/css3transitions.css'
        ],
        template: 'static/script-tests/jasmine/SpecRunner.html',
        outfile: 'static/script-tests/jasmine/WebRunner.html',
        keepRunner: true,
        display: 'full',
        templateOptions: {
          scriptRoot: '../..'
        },
        summary: true
      }
    },
    jsdoc: {
      dist: {
        src: [
          'static/script/**/**.js'
        ],
        options: {
          destination: 'jsdoc'
        }
      }
    },
    imagemin12: {
      static: {
        options: {
          optimizationLevel: 3
        },
        files: {
          // 'images/hisense/logo.png': 'images/hisense/logo.png',
        }
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          cwd: 'build/',
          expand: true,
          src: ['**/*.{png,jpg}'],
          dest: 'build'
        }]
      }
    },
    prompt: {
      target: {
        options: {
          questions: [
            {
              config: 'version',
              type: 'input',
              message: 'Enter version number',
              validate: function (value) {
                if (value === '') {
                  return 'Should not be blank'
                }
                return true
              }
            }
          ]
        }
      }
    },
    shell: {
      bump: {
        command: [
          'cd ..',
          'sh ./dev-tools/updateversion.sh <%= revision %>'
        ].join('&')
      },
      fetch_branch: {
        command: 'git rev-parse --abbrev-ref HEAD',
        options: {
          callback: function (err, stdout, stderr, cb) {
            grunt.log.writeln('found branch: ' + stdout)
            grunt.config.set('branch', stdout)
            cb()
          }
        }
      },
      fetch_remote: {
        command: 'git remote -v | grep push | awk \'{print $2}\'',
        options: {
          callback: function (err, stdout, stderr, cb) {
            grunt.log.writeln('found remote: ' + stdout)
            grunt.config.set('remote', stdout)
            cb()
          }
        }
      },
      gitadd: {
        command: 'git add <%= bumpfiles %>',
        options: {
          stdout: true
        }
      },
      gitcommit: {
        command: 'git commit -m "Updated version to <%= appinfo.version %>"',
        options: {
          stdout: true
        }
      },
      gitpush: {
        command: 'git push <%= remote %> HEAD:refs/for/<%= branch %>',
        options: {
          stdout: true
        }
      },
      selenium: {
        command: 'node static/integration-tests/test.js'
      },
      removetestfolders: {
        command: [
          'rmdir /s /q "static/script-tests" ',
          'rmdir /s /q "static/integration-tests" '
        ].join('&')
      },
      lgwebos: {
        command: [
          'mkdir build',
          'set PATH=%PATH%;%WEBOS_CLI_TV%',
          'ares-package -v -n -e "node_modules" -e "build" -o build ./',
          'cd build/',
          'rename *.ipk DStv_<%= appinfo.version %>_<%= date %>.ipk'
        ].join('&')
      },
      tizen: {
        command: [
          'set PATH=%PATH%;%TIZEN_CLI_TV%',
          'tizen build-web -e node_modules/*, build/* -- ./',
          'tizen package -t wgt -s DStvProfile -- .buildResult',
          'cd .buildResult',
          'rename *.wgt DStv_<%= appinfo.version %>_<%= date %>.wgt',
          'cd ../',
          'copy  .buildResult\\DStv_<%= appinfo.version %>_<%= date %>.wgt build\\DStv_<%= appinfo.version %>_<%= date %>.wgt'
        ].join('&')
      },
      renamehisense: {
        command: [
          'cd build/',
          'rename DStv_hisense DStv_<%= appinfo.version %>_<%= date %>_hisense'
        ].join('&')
      },
      renamexbox: {
        command: [
          'cd build/',
          'rename DStv_xbox DStv_<%= appinfo.version %>_<%= date %>_xbox'
        ].join('&')
      },
      msbuild: {
        command: 'MSBuild.exe DstvApp.jsproj /t:Rebuild /p:OutputPath="build" /p:Configuration=Release;Platform=x64;AppxBundle=Always'
      }
    },
    compress: {
      hisensezip: {
        options: {
          archive: 'build/DStv_<%= appinfo.version %>_<%= date %>_hisense.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: [
              'DStv_<%= appinfo.version %>_<%= date %>_hisense/**'
            ]
          }
        ]
      },
      xboxzip: {
        options: {
          archive: 'build/DStv_<%= appinfo.version %>_<%= date %>_xbox.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: [
              'DStv_<%= appinfo.version %>_<%= date %>_xbox/**'
            ]
          }
        ]
      }
    },
    copy: {
      hisense: {
        files: [
          {
            expand: true,
            src: [
              'logituit/**', 'static/fonts/**', 'static/img/**',
              'static/script/**', 'static/style/**',
              'tal/**', 'images/**', 'chrome.html',
              'gruntfile.js', 'hisense.html', 'package.json',
              'package-lock.json', 'README.md',
              'set-version.groovy'
            ],
            dest: 'build/DStv_hisense/'
          }
        ]
      },
      xbox: {
        files: [
          {
            expand: true,
            src: [
              'logituit/**', 'static/fonts/**', 'static/img/**',
              'static/script/**', 'static/style/**',
              'tal/**', 'images/**', 'debug/**', 'DstvApp.jsproj',
              'gruntfile.js', 'xbox.html', 'package.json',
              'package-lock.json', 'DstvApp.jsproj.user',
              'DstvApp_TemporaryKey.pfx', 'package.appxmanifest'
            ],
            dest: 'build/DStv_xbox/'
          }
        ]
      }
    },
    pagespeed: {
      options: {
        nokey: true,
        url: 'http://cdn.dstv.com/hisense/hisense.html'
      },
      hisense: {
        options: {
          url: 'http://cdn.dstv.com/hisense/hisense.html',
          locale: 'en_ZA',
          strategy: 'desktop',
          threshold: 80
        }
      }
    },
    bom: {
      addBom: {
        src: ['static/script/**/*.js',
          'static/style/**/*.css',
          'logituit/**/*.js',
          'logituit/**/*.css',
          'tal/**/*.css',
          'tal/**/*.js'
        ],
        options: {
          add: true
        }
      }
    },
    'string-replace': {
      hisensekey: {
        files: [{
          expand: true,
          src: 'hisense.html'
        }],
        options: {
          replacements: [{
            pattern: 'jxdcJn0jpAfaCFzTXpl3Bdp9dgdPdNBY',
            replacement: '1aX5V30fzduMMYP7Cw6PgCaYSF9aR1BZ'
          }]
        }
      },
      tizenkey: {
        files: [{
          expand: true,
          src: 'tizen.html'
        }],
        options: {
          replacements: [{
            pattern: 'IHFWqofNwHlv9i64ixcxubT5xuO8mR4k',
            replacement: '0wIybhrtrZ7kqLeRtArBM1FZHMkTLtyy'
          }]
        }
      },
      weboskey: {
        files: [{
          expand: true,
          src: 'webos.html'
        }],
        options: {
          replacements: [{
            pattern: 'iU2CX5HyDDo7xecP5crN8nBtFytTLkFV',
            replacement: '5uemYAdReviLedFySMovOh8e5wvPBg6F'
          }]
        }
      },
      xboxkey: {
        files: [{
          expand: true,
          src: 'xbox.html'
        }],
        options: {
          replacements: [{
            pattern: '9bOBY8Uy5O0ZCftsZNiVoZMo7dWXj5gZ',
            replacement: 'q7cNYGLyTsacyBdtYhPWYAo9TF1lwBNz'
          }]
        }
      },
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'build',
          src: ['./*.html'],
          dest: 'build'
        }]
      }
    },
    cssmin: {
      target: {
        expand: true,
        files: [{
          expand: true,
          cwd: 'build',
          src: ['static/**/*.css', 'logituit/**/*.css'],
          dest: 'build'
        }]
      }
    },
    uglify: {
      options: {
        mangle: true
      },
      build: {
        files: [
          {
            expand: true,
            cwd: "build/",
            src: ["**/*.js", "!*.min.js", "!player/*","!*gruntfile.js", "!*sonar-project.js"],
            dest: "build",
          }
        ]
      }
    },
    imagemin123: {
      dynamic: {
        options: {
          optimizationLevel: 4
        },
          files: [{
              expand: true,
              cwd: 'build/',
              src: ['**/*.{png,jpg,gif}'],
              dest: 'build/'
          }]
      }
  },
    imagemin: {
      static: {
        options: {
          optimizationLevel: 3
        },
        files: {

          // 'build/static/img/apply_cupon_percent.png': 'static/img/apply_cupon_percent.png',
          }
      }
    },
    cacheBust: {
      playercss: {
          options: {
              baseDir:'build',
              assets: ['static/style/layouts/720p.css', 'static/style/layouts/1080p.css'],
              hash: '<%= randomString %>',
              deleteOriginals:true
          },
          src: ['static/script/appui/layouts/720p.js', 'static/script/appui/layouts/1080p.js']
      },
      player: {
        options: {
          baseDir:'build',
            assets: ['player/*'],
            hash: '<%= randomString %>',
            deleteOriginals:true
        },
        src: ['build/index.html', 'build/chrome.html','webos.html', 'build/hisense.html','build/tizen.html', 'build/xbox.html']
    }
    },
    replace: {
      js720: {
          src: './build/static/script/appui/layouts/720p.js',
          dest: './build/static/script/appui/layouts/720p.js', //<-- creates a copy
          replacements: [{
            from: '720p.css', // matches all instances of .html'
            to: '720p.css?bust=<%=pkg.version%>' //<-- Note the dot separator at the start.
          }]
      },
      js1080: {
        src: './build/static/script/appui/layouts/1080p.js',
        dest: './build/static/script/appui/layouts/1080p.js', //<-- creates a copy
        replacements: [{
            from: '1080p.css', // matches all instances of .html'
            to: '1080p.css?bust=<%=pkg.version%>' //<-- Note the dot separator at the start.
        }]
      },
      updateSalesChannel: {
        src: './build/static/script/appui/globals.js',
        dest: './build/static/script/appui/globals.js', //<-- creates a copy
        replacements: [{
            from: 'SALES_CHANNEL: \'SAMSUNG_HTML_TV/\'', // matches all instances of .html'
            to: 'SALES_CHANNEL: "<%=salesChannel%>/"' //<-- Note the dot separator at the start.
        }]
      },
      updatePlatform: {
        src: './build/static/script/appui/globals.js',
        dest: './build/static/script/appui/globals.js', //<-- creates a copy
        replacements: [{
          from: 'PLATFORM_NAME: \'PLATFORM_NAME\'', // matches all instances of .html'
          to: 'PLATFORM_NAME: "<%=platform%>"' //<-- Note the dot separator at the start.
      }]
      },
    },
    copy: {
      build: {
        cwd: './',
        src: [ '**', '!**/coverage/**', '!**/node_modules/**'],
        dest: 'build',
        expand: true
      }
    },
    clean: {
      build: {
        src: [ 'build' ]
      },
    }

  })

  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-jasmine')
  grunt.loadNpmTasks('grunt-jsdoc')
  grunt.loadNpmTasks('grunt-contrib-htmlmin')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-imagemin')
  grunt.loadNpmTasks('grunt-contrib-compress')
  grunt.loadNpmTasks('grunt-shell')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-prompt')
  grunt.loadNpmTasks('grunt-standard')
  grunt.loadNpmTasks('grunt-contrib-csslint')
  grunt.loadNpmTasks('grunt-postcss')
  grunt.loadNpmTasks('grunt-babel')
  grunt.loadNpmTasks('grunt-eslint')
  grunt.loadNpmTasks('grunt-string-replace')
  grunt.loadNpmTasks('grunt-pagespeed')
  grunt.loadNpmTasks('grunt-byte-order-mark')
  grunt.loadNpmTasks('grunt-sonar-runner')
  grunt.loadNpmTasks('grunt-cache-bust');

  grunt.registerTask('selenium', [
    'shell:selenium'
  ])
  grunt.registerTask('test', [
    'jasmine'
  ])
  grunt.registerTask('lint', [
    'standard', 'csslint'
  ])
  grunt.registerTask('full', [
    'lint', 'test'
  ])
  grunt.registerTask('coverage',
    'Produce a coverage report of the main source files', [
      'jasmine:src:build', 'shell:coverage'
    ])
  grunt.registerTask('spec', [
    'jasmine:src:build', 'openspec'
  ])

  grunt.registerTask('readversion', 'Read current app version',
    function () {
      grunt.config.set('appinfo', grunt.file.readJSON('appinfo.json'))
    })
  grunt.registerTask('openspec', 'Open the generated Jasmine spec file',
    function () {
      var childProcess = require('child_process')
      var outfile = grunt.config('jasmine.options.outfile')
      grunt.log.writeln('Opening ' + outfile + '...')
      childProcess.exec('open ' + outfile)
    })

  grunt.registerTask('usetheforce_on', 'force the force option on if needed',
    function () {
      if (!grunt.option('force')) {
        grunt.config.set('usetheforce_set', true)
        grunt.option('force', true)
      }
    })
  grunt.registerTask('pathcheck', 'Checking CLI path', function () {
    if (!process.env.WEBOS_CLI_TV) {
      grunt.log.writeln('webOS CLI path not set')
    } else {
      grunt.log.writeln('webOS CLI path set')
    }
    if (!process.env.TIZEN_CLI_TV) {
      grunt.log.writeln('Tizen CLI path not set')
    } else {
      grunt.log.writeln('Tizen CLI path set')
    }
  })
  grunt.registerTask('updatekeys', ['string-replace'])

  grunt.registerTask('bump', [
    'shell:bump', 'readversion'//, 'shell:gitadd', 'shell:gitcommit'
  ])
/*   grunt.registerTask('minify', [
    'htmlmin', 'uglify', 'cssmin', 'imagemin'
  ]) */
  grunt.registerTask('remove_testfolders', [
    'shell:removetestfolders'
  ])
  grunt.registerTask('build_webos', [
    'babel', 'shell:lgwebos'
  ])
  grunt.registerTask('build_tizen', [
    'shell:tizen'
  ])
  grunt.registerTask('build_hisense', [
    'copy:hisense', 'shell:renamehisense', 'compress:hisensezip'
  ])
  grunt.registerTask('build_xbox', [
    'copy:xbox', 'shell:renamexbox', 'compress:xboxzip'
  ])
  grunt.registerTask('build_uwp', [
    'bom', 'shell:msbuild'
  ])
  grunt.registerTask('build_all', [
    'clean', 'minify', 'pathcheck', 'remove_testfolders', 'usetheforce_on', 'build_webos',
    'usetheforce_on', 'build_tizen', 'build_hisense', 'build_xbox'
  ])
  grunt.registerTask(
    'build', 
    'Compiles all of the assets and copies the files to the build directory.', 
    [ 'clean', 'copy', 'babel', 'cssmin','uglify','imagemin', 'replace:js720', 'replace:js1080', 'replace:updateSalesChannel', 'replace:updatePlatform']
  );

}
//'clean', 'copy', 'babel', 'cssmin','imagemin','replace:playerFiles', 'replace:videocomponentcss2016', 'replace:js720', 'replace:js1080', 'replace:updateSalesChannel', 