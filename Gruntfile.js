var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
	port: LIVERELOAD_PORT
});

var folderMount = function(connect, dir) {
	return require('serve-static')(require('path').resolve(dir));
};

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	  
	project: {
		src: 'src',
		dist: 'dist',
		css: 'src/styles/threesixty.scss',
		js: 'src/js/threesixty.js'
	},
	
	//Project banner
	tag: {
		banner: '/*! <%= pkg.name %> <% grunt.template.today("yyy-mm-dd") %> version <%= pkg.version %> */\n'+'/* <%= pkg.repository.url %> */\n'
	},
	  
	usebanner: {
		taskName: {
			options: {
				position: 'top',
				banner: '<%= tag.banner %>',
				linebreak: true
			},
			files: {
				src: ['dist/css/threesixty.css', 'dist/js/threesixty.js']
			}
		}
	},
	  
	//Live Reload
	connect: {
		options: {
			port: 9992,
			hostname: '*',
			base: 'threesixty-slider'
		},
		livereload: {
			options: {
				middleware: function(connect) {
					return [lrSnippet, folderMount(connect, '.')];
				}
			}
		}
	},
    
	copy: {
		main: {
			files: [
				{
					expand: true,
					flatten: true,
					src: 'node_modules/jquery/dist/jquery.min.js',
					dest: 'dist/vendor/',
					filter: 'isFile'
				},
				{
					expand: true,
					flatten: true,
					src: 'node_modules/screenfull/dist/screenfull.js',
					dest: 'dist/vendor/',
					filter: 'isFile'
				},
				{
					expand: true,
					flatten: true,
					src: 'src/js/threesixty.js',
					dest: 'dist/js/',
					filter: 'isFile'
				}
			]
		}
	},
	
	clean: {
		dist: [
			'dist/css/threesixty.unprefixed.css',
			'dist/css/threesixty.unprefixed.css.map'
		]
	},
	  
	//JSHint
    jshint: {
      	files: [
			'src/**/*.js',
			'gruntfile.js'
		],
		options: {
			curly: true,
			eqeqeq: true,
			eqnull: false,
			browser: true,
			quotmark: 'single',
			globals: {
				jQuery: true
			}
		}
    },
	  
	//Compress and minify
	uglify: {
		dist: {
			src: 'dist/js/threesixty.js',
			dest: 'dist/js/threesixty.min.js'
		}
	},
	  
	// Compile Sass
	sass: {
		dev: {
			src: 'src/styles/*.scss',
			dest: 'dist/css/threesixty.unprefixed.css',
			options: {
				style: 'expanded'
			}
		}
	},
	  
	//autoprefixer
	autoprefixer: {
		options: {
			browsers: [
				'last 2 version',
				'safari 6',
				'ie 9',
				'opera 12.1',
				'ios 6',
				'android 4'
			]
		},
		dev: {
			src: 'dist/css/threesixty.unprefixed.css',
			dest: 'dist/css/threesixty.css'
		},
		dist: {
			src: 'dist/css/threesixty.unprefixed.css',
			dest: 'dist/css/threesixty.css'
		}
	},
	  
	//CSS minification
	cssmin: {
		dev: {
			src: 'dist/css/threesixty.css',
			dest: 'dist/css/threesixty.min.css'
		},
		dist: {
			src: 'dist/css/threesixty.css',
			dest: 'dist/css/threesixty.min.css'
		}
	},
	  
	// Web Server
	open: {
		server: {
			path: 'http://localhost:<%= connect.options.port %>'
		}
	},
	  
	// Watch & update on the fly
	watch: {
		jshint: {
			files: 'src/**/*.js',
			tasks: ['copy', 'jshint']
		},
		sass: {
			files: 'src/styles/*.scss',
			tasks: ['sass:dev', 'cssmin:dev', 'autoprefixer:dev']
		},
		livereload: {
			options: {
				livereload: LIVERELOAD_PORT
			},
			files: [
				'*.html',
				'dist/css/*.css',
				'dist/js/*.js'
			]
		}
	},

	qunit: {
            all: ['tests/**/*.html']
        }
    });

    //Run 'grunt'
    grunt.registerTask('default', [
        'copy',
        'sass:dev',
        'autoprefixer:dev',
        'cssmin:dev',
        'jshint',
        'usebanner',
        'connect:livereload',
        'open',
        'watch'
    ]);

    //Run 'grunt qunit'
    grunt.registerTask('qunit', [
        'qunit'
    ]);

    //Run 'grunt build'
    grunt.registerTask('build', [
        'copy',
        'sass:dist',
        'autoprefixer:dist',
        'cssmin:dist',
        'clean:dist',
        'jshint',
        'uglify',
        'usebanner'
    ]);
};
