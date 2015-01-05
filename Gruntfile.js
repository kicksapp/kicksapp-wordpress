var merge = require("deepmerge");
var path = require('path');

module.exports = function(grunt) {
 
  grunt.initConfig({
    dist: grunt.option('output') || 'dist',
    phpbin: '/Applications/MAMP/bin/php/php5.6.2/bin',
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      'build': "<%= dist %>",
      'tmp': ['tmp']
    },
    copy: {
      'dist': {
        dot: true,
        expand: true, 
        cwd: '.',
        src: ['wp/**/*', 'vendor/**/*', 'index.php', '.htaccess'], 
        dest: grunt.option('output') || "<%= dist %>"
      },
      'broccoli': {
        dot: true,
        expand: true, 
        cwd: 'tmp/broccoli_build',
        src: ['**/*.*'], 
        dest: grunt.option('output') || "<%= dist %>/app"
      }
    },
    curl: {
      'wordpress': {
          src: 'http://wordpress.org/latest.zip',
          dest: 'tmp/downloads/wordpress/latest.zip'
      }, 
      'composer': {
        src: 'https://getcomposer.org/installer',
        dest: 'composer.phar'
      }
    },
    unzip: {
      "wordpress": {
        cwd: 'wordpress',
        src: "tmp/downloads/wordpress/latest.zip",
        dest: "tmp/wordpress"
      }
    },
    template: {
      'dist': {
          options: {
            data: function() {
              return merge( 
                grunt.file.readJSON('config/application.json'), 
                grunt.file.readJSON('config/environment/' + ( grunt.option("environment")  || 'development' ) + '.json') 
              );
            }
          },
          src: 'wp-config.php',
          dest: ( grunt.option('output') || "<%= dist %>" ) + "/wp-config.php"
      }
    },
    php: {
      serve: {
        options: {
          bin: "/Applications/MAMP/bin/php/php5.4.34/bin/php",
          base: 'dist',
          keepalive: true,
          open: true
        }
      }
    },
    broccoli: {
      dist: {
        cwd: 'app',
        env: ( grunt.option('target') || 'development' ),
        dest: 'tmp/broccoli_build',
        config: 'Brocfile.js'
      }
    },
    rsync: {
      options: {
        src: "<%= dist %>/.",
        //args: ["--verbose"],
        recursive: true
      },
      development: {
        options: {
          dest: "/Applications/MAMP/htdocs/kicksapp/",
          delete: true
        }
      },
      test: {
        options: {
          dest: "/var/www/site",
          host: "user@staging-host",
          delete: true // Careful this option could cause data loss, read the docs!
        }
      },
      production: {
        options: {
          dest: "/var/www/site",
          host: "user@live-host",
          delete: true // Careful this option could cause data loss, read the docs!
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-broccoli');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-template');
  grunt.loadNpmTasks('grunt-php');
  grunt.loadNpmTasks('grunt-curl');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-phpdocumentor');
  grunt.loadNpmTasks('grunt-wp-i18n');
  grunt.loadNpmTasks('grunt-rsync');
 
  /**
   * This task downloads the latest wordpress to dist
   */
  grunt.registerTask('install', [
    'clean:tmp',
    'curl:wordpress',
    'unzip:wordpress',
    'copy:wordpress',
    'clean:tmp'
  ]);
  
  grunt.registerTask('build', [
    'clean:build',
    'clean:tmp',
    'broccoli:dist:build',
    'copy:dist',
    'copy:broccoli',
    'template:dist',
    //'clean:tmp'
  ]);
  
  grunt.registerTask('deploy', [
    'build',
    'rsync:' + (grunt.option('target') || 'development')
  ]);
  
  grunt.registerTask('serve', [
    'php:serve'
  ]);
  
};