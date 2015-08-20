module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    react: {
      react: {
          files: {
            expand: true,
            cwd: 'src/',//输入文件夹
            src: ['**/*.jsx'],//所有jsx文件
            dest: 'build/',//输出文件夹
            ext: '.js'
          }
        },
    },
    browserify: {
      dist: {
        files: {
          'build/bundle.js': 'build/main.js',
        }
      }
    },
    less: {
      development: {
        files: {
          "css/common.css": "less/common.less"
        }
      }
    },
    watch:{
      less:{
        files: ['less/*.less'],
        tasks: ['less']
      },
      react: {
        files: ['src/**/*.jsx'],
        tasks: ['react','browserify']
      },
      browserify:{
        files: ['src/*.js'],
        tasks: ['browserify']
      }

    }//监听文件变化

  });

  // 加载任务的插件。
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-react');
  // 默认被执行的任务列表。
  grunt.registerTask('default', ['watch']);


};