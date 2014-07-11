// module.exports = function (grunt) {

//     require('load-grunt-tasks')(grunt);

//     grunt.initConfig({
//         pkg: grunt.file.readJSON('package.json'),

//         jshint: {
//             all: [
//                 'public/javascripts/*.js',
//                 '*.js'
//             ]
//         },

//         concurrent: {
//             dev: {
//                 tasks: ['nodemon', 'node-inspector', 'watch'],
//                 options: {
//                     logConcurrentOutput: true
//                 }
//             }
//         },

//         inject: {
//             multiple : {
//                 scriptSrc: ['public/javascripts/dex.js', 'public/javascripts/fun.js'],
//                 files: [{
//                     expand: true,
//                     cwd: 'src',
//                     src: ['views/*'],
//                     dest: 'dist'
//                 }]
//             }
//         },

//         nodemon: {
//             dev: {
//                 script: 'app.js',
//                 options: {
//                     nodeArgs: ['--debug'],
//                     env: {
//                         PORT: '3000'
//                     },
//                     callback: function (nodemon) {
//                         nodemon.on('log', function (e) {
//                             console.log(e.colour);
//                         });
//                         nodemon.on('config:update', function () {
//                             setTimeout(function () {
//                                 require('open')('http://0.0.0.0:3000/');
//                             }, 1000);
//                         });
//                         nodemon.on('restart', function () {
//                             setTimeout(function () {
//                                 require('fs').writeFileSync('.rebooted', 'rebooted');
//                             }, 1000);
//                         });
//                     }
//                 }
//             }
//         },

//         open: {
//             dev: {
//                 path: "http://0.0.0.0:3000/",
//                 app: "Google Chrome"
//             }
//         },

//         watch: {
//             server: {
//                 files: ['.rebooted'],
//                 options: {
//                     livereload: true
//                 }
//             }
//             // options: {
//             //     reload: true
//             // },
//             // js: {
//             //     files: ['public/javascripts/*.js'],
//             //     tasks: ['jshint'],
//             //     options: {}
//             // }
//         }

//     });

//     grunt.registerTask('default', [
//         'jshint',
//         'inject',
//         'concurrent'
//     ]);

// };

module.exports = function(grunt) {
 
  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
 
  // Configure Grunt 
  grunt.initConfig({
 
    // grunt-contrib-connect will serve the files of the project
    // on specified port and hostname
    connect: {
      all: {
        options:{
          port: 9000,
          hostname: "0.0.0.0",
          // No need for keepalive anymore as watch will keep Grunt running
          //keepalive: true,
 
          // Livereload needs connect to insert a cJavascript snippet
          // in the pages it serves. This requires using a custom connect middleware
          middleware: function(connect, options) {
 
            return [
 
              // Load the middleware provided by the livereload plugin
              // that will take care of inserting the snippet
              require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
 
              // Serve the project folder
              connect.static(options.base)
            ];
          }
        }
      }
    },
 
    // grunt-open will open your browser at the project's URL
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= connect.all.options.port%>'
      }
    },
 
    // grunt-regarde monitors the files and triggers livereload
    // Surprisingly, livereload complains when you try to use grunt-contrib-watch instead of grunt-regarde 
    regarde: {
      all: {
        // This'll just watch the index.html file, you could add **/*.js or **/*.css
        // to watch Javascript and CSS files too.
        files:['index.html'],
        // This configures the task that will run when the file change
        tasks: ['livereload']
      }
    }
  });
 
  // Creates the `server` task
  grunt.registerTask('server',[
    
    // Starts the livereload server to which the browser will connect to
    // get notified of when it needs to reload
    'livereload-start',
    'connect',
    // Connect is no longer blocking other tasks, so it makes more sense to open the browser after the server starts
    'open',
    // Starts monitoring the folders and keep Grunt alive
    'regarde'
  ]);
};