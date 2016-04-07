/*
 * ---------------------------------------------------------------------------
 *
 * COPYRIGHT (c) 2016 Mnubo Inc. All Rights Reserved.
 *
 * The copyright to the computer program(s) herein is the property of Mnubo
 * Inc. The program(s) may be used and/or copied only with the written
 * permission from Mnubo Inc. or in accordance with the terms and conditions
 * stipulated in the agreement/contract under which the program(s) have been
 * supplied.
 *
 * ---------------------------------------------------------------------------
 */
/* eslint max-len: 0 */
/* eslint camelcase: 0 */

'use strict';
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
module.exports = function(grunt) {
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);
    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt,
        {
            useminPrepare: 'grunt-usemin',
            ngtemplates: 'grunt-angular-templates',
            cdnify: 'grunt-google-cdn'
        });
    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist'
    };
    grunt.option('force', true);
    // Define the configuration for all the tasks
    grunt.initConfig(
        {
        // Project settings
            yeoman: appConfig,
            server: 'server',

            express: {
                dev: {
                    options: {
                        script: './server/server.js',
                        node_env: 'development',
                        spawn: false
                    }
                },
                prod: {
                    options: {
                        script: './server/server.js',
                        node_env: 'production',
                        spawn: false
                    }
                }
            },

            jsbeautifier: {

                files: ['<%= yeoman.app %>/scripts/{,*/}*.js',
                '<%= yeoman.app %>/scripts/{,*/}*.html',
                '<%= yeoman.app %>/scripts/{,*/}*.css',
                '<%= server %>/{,*/}*.js'],
                options: {

                    mode: 'VERIFY_AND_WRITE',

                    html: {
                        braceStyle: 'collapse',
                        indentChar: ' ',
                        indentScripts: 'keep',
                        indentSize: 4,
                        maxPreserveNewlines: 10,
                        preserveNewlines: true,
                        unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u'],
                        wrapLineLength: 0
                    },
                    css: {
                        indentChar: ' ',
                        indentSize: 4
                    },

                    js: {
                        braceStyle: 'collapse',
                        camelcase: true,
                        breakChainedMethods: false,
                        e4x: false,
                        evalCode: false,
                        indentChar: ' ',
                        indentLevel: 0,
                        indentSize: 4,
                        eqeqeq: true,
                        indentWithTabs: false,
                        jslintHappy: false,
                        trailing: true,
                        keepArrayIndentation: false,
                        keepFunctionIndentation: false,
                        maxPreserveNewlines: 10,
                        preserveNewlines: true,
                        spaceBeforeConditional: true,
                        spaceInParen: false,
                        unescapeStrings: false,
                        wrapLineLength: 0,
                        endWithNewline: true
                    }
                }

            },

            open: {
                all:
                {
                    path: 'http://localhost:3000'
                }
            },

        // Watches files for changes and runs tasks based on the changed files
            watch:
            {
                bower:
                {
                    files: ['bower.json'],
                    tasks: ['wiredep']
                },
                js:
                {
                    files: ['<%= yeoman.app %>/scripts/{,*/}*.{js,html}'],
                    tasks: ['newer:eslint:client','express:dev','open'],
                    options:
                    {
                        livereload: true
                    }
                },
                node:
                {
                    files: ['<%= server %>/{,*/}*.js'],
                    tasks: ['newer:eslint:server','express:dev','open'],
                    options:
                    {
                        livereload: true
                    }
                },
                jsTest:
                {
                    files: ['test/spec/{,*/}*.js'],
                    tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
                },
                styles:
                {
                    files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                    tasks: ['newer:copy:styles', 'postcss']
                },
                gruntfile:
                {
                    files: ['Gruntfile.js']
                },
                livereload:
                {
                    options:
                    {
                        livereload: true
                    },
                    files: ['<%= yeoman.app %>/{,*/}*.html', '.tmp/styles/{,*/}*.css',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= server %>/{,*/}*.js']
                }
            },

        // Make sure there are no obvious mistakes
            jshint:
            {
                options:
                {
                    jshintrc: '.jshintrc',
                    reporter: require('jshint-stylish')
                },
                all:
                {
                    src: ['Gruntfile.js', '<%= yeoman.app %>/scripts/{,*/}*.js']
                },
                test:
                {
                    options:
                    {
                        jshintrc: 'test/.jshintrc'
                    },
                    src: ['test/spec/{,*/}*.js']
                }
            },
        // eslint
            eslint:
            {
                client: ['Gruntfile.js', '<%= yeoman.app %>/scripts/{,*/}*.js'],
                server: ['<%= server %>/{,*/}*.js'],
                all: ['Gruntfile.js', '<%= yeoman.app %>/scripts/{,*/}*.js',
                '<%= server %>/{,*/}*.js']
            },
        // Make sure code styles are up to par
            jscs:
            {
                options:
                {
                    config: '.jscsrc',
                    verbose: true
                },
                all:
                {
                    src: ['Gruntfile.js', '<%= yeoman.app %>/scripts/{,*/}*.js']
                },
                test:
                {
                    src: ['test/spec/{,*/}*.js']
                }
            },
        // Empties folders to start fresh
            clean:
            {
                dist:
                {
                    files: [
                        {
                            dot: true,
                            src: ['.tmp', '<%= yeoman.dist %>/{,*/}*',
                            '!<%= yeoman.dist %>/.git{,*/}*']
                        }]
                },
                server: '.tmp'
            },
        // Add vendor prefixed styles
            postcss:
            {
                options:
                {
                    processors: [
                        require('autoprefixer-core')(
                            {
                                browsers: ['last 1 version']
                            })
                    ]
                },
                server:
                {
                    options:
                    {
                        map: true
                    },
                    files: [
                        {
                            expand: true,
                            cwd: '.tmp/styles/',
                            src: '{,*/}*.css',
                            dest: '.tmp/styles/'
                        }]
                },
                dist:
                {
                    files: [
                        {
                            expand: true,
                            cwd: '.tmp/styles/',
                            src: '{,*/}*.css',
                            dest: '.tmp/styles/'
                        }]
                }
            },
        // Automatically inject Bower components into the app
            wiredep:
            {
                app:
                {
                    src: ['<%= yeoman.app %>/index.html'],
                    ignorePath: /\.\.\//
                },
                test:
                {
                    devDependencies: true,
                    src: '<%= karma.unit.configFile %>',
                    ignorePath: /\.\.\//,
                    fileTypes:
                    {
                        js:
                        {
                            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                            detect:
                            {
                                js: /'(.*\.js)'/gi
                            },
                            replace:
                            {
                                js: '\'{{filePath}}\','
                            }
                        }
                    }
                }
            },
        // Renames files for browser caching purposes
            filerev:
            {
                dist:
                {
                    src: ['<%= yeoman.dist %>/scripts/{,*/}*.js',
                    '<%= yeoman.dist %>/styles/{,*/}*.css',
                    '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= yeoman.dist %>/styles/fonts/*']
                }
            },
        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
            useminPrepare:
            {
                html: '<%= yeoman.app %>/index.html',
                options:
                {
                    dest: '<%= yeoman.dist %>',
                    flow:
                    {
                        html:
                        {
                            steps:
                            {
                                js: ['concat', 'uglifyjs'],
                                css: ['cssmin']
                            },
                            post:
                        {}
                        }
                    }
                }
            },
        // Performs rewrites based on filerev and the useminPrepare configuration
            usemin:
            {
                html: ['<%= yeoman.dist %>/{,*/}*.html'],
                css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
                js: ['<%= yeoman.dist %>/scripts/{,*/}*.js'],
                options:
                {
                    assetsDirs: ['<%= yeoman.dist %>',
                    '<%= yeoman.dist %>/images', '<%= yeoman.dist %>/styles'],
                    patterns:
                    {
                        js: [
                        [/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g,
                        'Replacing references to images']
                        ]
                    }
                }
            },
        // The following *-min tasks will produce minified files in the dist folder
        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/styles/main.css': [
        //         '.tmp/styles/{,*/}*.css'
        //       ]
        //     }
        //   }
        // },
        // uglify: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/scripts/scripts.js': [
        //         '<%= yeoman.dist %>/scripts/scripts.js'
        //       ]
        //     }
        //   }
        // },
        // concat: {
        //   dist: {}
        // },
            imagemin:
            {
                dist:
                {
                    files: [
                        {
                            expand: true,
                            cwd: '<%= yeoman.app %>/images',
                            src: '{,*/}*.{png,jpg,jpeg,gif}',
                            dest: '<%= yeoman.dist %>/images'
                        },
                        {
                            expand: true,
                            cwd: '<%= yeoman.app %>',
                            src: 'favicon.ico',
                            dest: '<%= yeoman.dist %>'
                        }]
                }
            },
            svgmin:
            {
                dist:
                {
                    files: [
                        {
                            expand: true,
                            cwd: '<%= yeoman.app %>/images',
                            src: '{,*/}*.svg',
                            dest: '<%= yeoman.dist %>/images'
                        }
                    ]
                }
            },
            htmlmin:
            {
                dist:
                {
                    options:
                    {
                        collapseWhitespace: true,
                        conservativeCollapse: true,
                        collapseBooleanAttributes: true,
                        removeCommentsFromCDATA: true
                    },
                    files: [
                        {
                            expand: true,
                            cwd: '<%= yeoman.dist %>',
                            src: ['*.html'],
                            dest: '<%= yeoman.dist %>'
                        }]
                }
            },
            ngtemplates:
            {
                dist:
                {
                    options:
                    {
                        module: 'ScoresexplorerApp',
                        htmlmin: '<%= htmlmin.dist.options %>',
                        usemin: 'scripts/scripts.js'
                    },
                    cwd: '<%= yeoman.app %>',
                    src: 'views/{,*/}*.html',
                    dest: '.tmp/templateCache.js'
                }
            },
        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
            ngAnnotate:
            {
                dist:
                {
                    files: [
                        {
                            expand: true,
                            cwd: '.tmp/concat/scripts',
                            src: '*.js',
                            dest: '.tmp/concat/scripts'
                        }]
                }
            },
        // Replace Google CDN references
            cdnify:
            {
                dist:
                {
                    html: ['<%= yeoman.dist %>/*.html']
                }
            },
        // Copies remaining files to places other tasks can use
            copy:
            {
                dist:
                {
                    files: [
                        {
                            expand: true,
                            dot: true,
                            cwd: '<%= yeoman.app %>',
                            dest: '<%= yeoman.dist %>',
                            src: ['*.{ico,png,txt}', '*.html',
                            'images/{,*/}*.{webp}', 'styles/fonts/{,*/}*.*']
                        },
                        {
                            expand: true,
                            cwd: '.tmp/images',
                            dest: '<%= yeoman.dist %>/images',
                            src: ['generated/*']
                        },
                        {
                            expand: true,
                            cwd: 'bower_components/bootstrap/dist',
                            src: 'fonts/*',
                            dest: '<%= yeoman.dist %>'
                        },
                        {
                            expand: true,
                            cwd: 'bower_components/rdash-ui/dist',
                            src: 'fonts/*',
                            dest: '<%= yeoman.dist %>'
                        },
                        {
                            expand: true,
                            cwd: 'bower_components/select2',
                            src: '*.png',
                            dest: '<%= yeoman.dist %>/styles'
                        }

                    ]
                },
                styles:
                {
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles',
                    dest: '.tmp/styles/',
                    src: '{,*/}*.css'
                }
            },
        // Run some tasks in parallel to speed up the build process
            concurrent:
            {
                server: ['copy:styles'],
                test: ['copy:styles'],
                dist: ['copy:styles', 'imagemin', 'svgmin']
            },
        // Test settings
            karma:
            {
                unit:
                {
                    configFile: 'test/karma.conf.js',
                    singleRun: true
                }
            }
        });

    grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build','express:prod','open','watch']);
        }

        return grunt.task.run(['clean:server', 'wiredep', 'concurrent:server',
        'postcss:server','newer:eslint:all','express:dev','open', 'watch']);
    });

    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    //grunt.registerTask('express',['express:dev']);
    grunt.registerTask('test', ['clean:server', 'wiredep', 'concurrent:test', 'postcss',
    'connect:test', 'karma']);
    grunt.registerTask('build', ['clean:dist', 'wiredep', 'useminPrepare', 'concurrent:dist',
    'postcss', 'ngtemplates', 'concat', 'ngAnnotate', 'copy:dist', 'cdnify', 'cssmin', 'uglify',
    'filerev', 'usemin', 'htmlmin']);
    grunt.registerTask('default', ['newer:jshint', 'newer:jscs', 'test', 'build']);
};
