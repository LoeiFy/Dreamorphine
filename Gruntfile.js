module.exports = function(grunt) {

    grunt.initConfig({

        uglify: {

            global: {
                options: {
                    banner: '/* http://lorem.in  @author LoeiFy@gmail.com */ \n'
                },
                files: {
                    'dist/global.js': [
                        'assets/index.js'
                    ]
                }
            }
            
        },

        cssmin: {

            global: {
                files: {
                    'dist/global.css': [
                        'assets/index.css'
                    ]
                }
            }

        },

        replace: {

            html: {
                options: {
                    patterns: [
                        {
                            match: 'style',
                            replacement: '<%= grunt.file.read("assets/module/css/base.css") %>'
                        }
                    ]
                },
                files: [
                    { expand: true, flatten: true, src: ['views/*'], dest: '.tmp/' }
                ]
            }

        },

        htmlmin: {

            html: {

                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },

                files: {
                    'index.html': '.tmp/index.html',
                    'about/index.html': '.tmp/index.html'
                }

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
            }

        },

        image_resize: {

            thumbnails: {
                options: {
                    width: 150,
                    quality: 0.8,
                    overwrite: false
                },
                src: 'covers/*.jpg',
                dest: 'thumbnails/'
            },

            large: {
                options: {
                    width: 300,
                    quality: 0.8,
                    overwrite: false
                },
                src: 'covers/*.jpg',
                dest: 'large/'
            },

        }

    });

    // grunt plugin
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-fileindex');
    grunt.loadNpmTasks('grunt-image-resize');

    grunt.registerTask('default', ['htmlmin:html']);
};
