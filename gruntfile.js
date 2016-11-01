/**
 * Created by matthew.sanders on 2/24/14.
 */
// TODO: this isnt working right now need to fix it
module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bumpup: {
            file: 'package.json'
        },

        compress: {
            main: {
                options: {
                    archive: 'release/<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                files: [
                  {src: ['app.js'], dest: '/'},
                  {src: ['package.json'], dest: '/'},
                  {src: ['README.md'], dest: '/'},
                  {src: ['config/**'], dest: '/'},
                  {src: ['public/**'], dest: '/'},
                  {src: ['routes/**'], dest: '/'},
                  {src: ['util/**'], dest: '/'}
                ]
            }
        }
    }),

    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('build', [
        'compress', 'bumpup'
    ]);
};