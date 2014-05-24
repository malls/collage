module.exports = function(grunt){
  "use strict";

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: [
        'public/javascripts/*.js',
        '*.js'
      ]
    },

    concurrent: {
      dev: {
        tasks: ['nodemon', 'node-inspector', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    inject: {
      multiple : {
        scriptSrc: ['public/javascripts/dex.js', 'public/javascripts/fun.js'],
        files: [{
          expand: true,
          cwd: 'src',
          src: ['views/*'],
          dest: 'dist'
        }]
      }
    },

    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          nodeArgs: ['--debug'],
          env: {
            PORT: '3000'
          },
          callback: function(nodemon){
            nodemon.on('log', function(e){
              console.log(e.colour);
            });
            nodemon.on('config:update', function(){
              setTimeout(function(){
                require('open')('http://127.0.0.1:3000/');
              }, 1000);
            });
            nodemon.on('restart', function(){
              setTimeout(function(){
                require('fs').writeFileSync('.rebooted', 'rebooted');
              }, 1000);
            });
          } 
        }
      }
    },

    open: {
      dev: {
        path: "http://127.0.0.1:3000/",
        app: "Google Chrome"
      }
    },

    watch: {
      server: {
        files: ['.rebooted'],
        options: {
          livereload: true
        }
      }
      // options: {
      //   reload: true
      // },
      // js: {
      //   files: ['public/javascripts/*.js'],
      //   tasks: ['jshint'],
      //   options: {}
      // }
    }

  });

  grunt.registerTask('default', [
    'jshint',
    'inject',
    'concurrent'
  ]);

};