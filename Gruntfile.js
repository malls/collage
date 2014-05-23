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

    nodemon: {
      dev: {
        script: 'app.js'
      }
    },

    open: {
      dev: {
        path: "http://127.0.0.1:3000/",
        app: "Google Chrome"
      }
    },

    watch: {
      options: {
        reload: true
      },
      js: {
        files: ['public/javascripts/*.js'],
        tasks: ['jshint'],
        options: {}
      }
    }

  });

  grunt.registerTask('default', [
    'jshint',
    'nodemon',
    'open',
    'watch'
  ]);

};