module.exports = function(grunt) {

    grunt.initConfig({

        uglify: {

            global: {
                options: {
                    banner: '/* http://lorem.in  @author LoeiFy@gmail.com */ \n'
                },
                files: {
                    'dist/Dreamorphine.js': [
                        'assets/Dreamorphine.js'
                    ]
                }
            }
            
        },

        cssmin: {

            global: {
                files: {
                    'dist/Dreamorphine.css': [
                        'assets/Dreamorphine.css'
                    ]
                }
            }

        },

        image_resize: {

            thumbnails: {
                options: {
                    width: 150,
                    overwrite: false
                },
                src: 'covers/*.jpg',
                dest: 'thumbnails/'
            }

        },

        fileindex: {

            list: {
                options: {
                    format: function(list, options, dest) {
                        var str = "var covers='"+ list + "';";
                        return str.replace(/covers\//g, '').replace(/.jpg/g, '');
                    }
                },
                files: [
                    {dest: 'temp/covers.js', src: ['covers/*']}
                ]
            },

            covers: {
                options: {
                    format: 'lines',
                    absolute: false
                },
                files: [
                    {dest: 'temp/covers.txt', src: ['covers/*']}
                ]
            },

            thumbnails: {
                options: {
                    format: 'lines',
                    absolute: false
                },
                files: [
                    {dest: 'temp/thumbnails.txt', src: ['thumbnails/*']}
                ]
            }

        },

        replace: {

            html: {
                options: {
                    patterns: [
                        {
                            match: 'covers',
                            replacement: '<%= grunt.file.read("temp/covers.js") %>'
                        }
                    ]
                },
                files: {
                    'index.html': '_index.html'
                }
            },

            cache: {
                options: {
                    patterns: [
                        {
                            match: 'covers',
                            replacement: '<%= grunt.file.read("temp/covers.txt") %>'
                        },
                        {
                            match: 'thumbnails',
                            replacement: '<%= grunt.file.read("temp/thumbnails.txt") %>'
                        }
                    ]
                },
                files: {
                    'Dreamorphine.appcache': '_Dreamorphine.appcache'
                }
            }

        }

    });

    // grunt plugin
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-fileindex');
    grunt.loadNpmTasks('grunt-image-resize');

    grunt.registerTask('default', ['uglify', 'cssmin', 'image_resize', 'fileindex', 'replace']);
};
