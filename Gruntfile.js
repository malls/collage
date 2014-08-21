module.exports = function (grunt) {

    'use strict';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: [
                'public/javascripts/*.js',
                'app/*.js',
                'lib/*.js',     
                'controllers/*.js'
                ]
        },

        concurrent: {
            all: {
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

        open: {
            dev: {
                path: 'http://0.0.0.0:3000/',
                app: 'Google Chrome'
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
                    callback: function (nodemon) {
                        nodemon.on('log', function (e) {
                            console.log(e.colour);
                        });
                        nodemon.on('config:update', function () {
                            setTimeout(function () {
                                require('open')('http://0.0.0.0:3000/');
                            }, 1000);
                        });
                        nodemon.on('restart', function () {
                            setTimeout(function () {
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        },

        watch: {
            server: {
                files: ['.rebooted'],
                options: {
                    livereload: true
                }
            },
            options: {
                reload: true
            },
            js: {
                files: ['controllers/*.js', 'public/javascripts/*.js', 'app/*.js', 'lib/*.js'],
                options: {}
            }
        }

    });

    grunt.registerTask('default', [
        'jshint',
        'inject',
        'concurrent'
    ]);

    grunt.registerTask('dev', [
        'nodemon',
        'open',
        'watch'
    ]);
};