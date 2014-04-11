module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      options: {
        livereload: 3000
      },
      js: {
        files: [
          'app.js',
          'public/stylesheets/*.css',
          'public/javascripts/*.js',
          'routes/*.js',
          'lib/*.js',
          'views/*.jade'
        ],
        tasks: ['develop'],
        options: { spawn: true }
      }
    },
    develop: {
      server: {
        file: 'app.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-develop');

  grunt.registerTask('default', ['develop']);

};