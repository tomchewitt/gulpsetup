// LOAD IN REQS
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	prefix = require('gulp-autoprefixer'),
	colors = require('colors/safe'),
	dateformat = require('dateformat'),
	gutil = require('gulp-util'),
	size = require('gulp-size'),
	eslint = require('gulp-eslint'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	streamify = require('gulp-streamify'),
	watch = require('gulp-watch'),
	debug = require('gulp-debug'),
	browserSync = require('browser-sync').create();


// VARS
var	paths = {
	    styles: {
	        src: 'src/scss',
	        files: 'src/scss/**/*.scss',
	        dest: 'public/dist/css'
	    },
	    scripts: {
	    	src: 'src/js/core/app.js',
	    	// files: 'src/js/**/*.js',
	    	files: {
	    		vendor: [
	    			'src/js/vendor/jquery.js',
					'src/js/vendor/greensock/TweenMax.min.js',
					'src/js/vendor/greensock/utils/SplitText.min.js',
					'src/js/vendor/greensock/plugins/Physics2DPlugin.min.js',
					'src/js/vendor/BezierEasing.js'
	    		],
	    		app: [
	    			'src/js/core/*.js',
					'src/js/controllers/TemplateController.js',
					'src/js/controllers/HomeController.js',
					'src/js/controllers/EggController.js',
					'src/js/controllers/ResponseController.js',
					'src/js/controllers/ThanksController.js'
	    		]
	    	},
	    	dest: 'public/dist/js'
	    }
	},
	bsProxy = 'delmonte-christmas.local',
	watch,
	F = {
		_logger: function(e) {
			var now = new Date();
		    console.log(
		    	'[' + gutil.colors.grey(dateformat(now, 'HH:MM:ss')) + '] ' +
		    	gutil.colors.cyan.italic(e.path.split(__dirname + '/')[1]) +
		    	' : ' + e.type
		    );
		}
	}


// SCRIPT TASKS
gulp.task('scripts-vendor', function() {
	return gulp.src(paths.scripts.files.vendor, {base: 'src'})
		.pipe(debug())
		.pipe(concat('bundle.js'))
		.pipe(uglify())
		.pipe(rename('bundle.min.js'))
		.pipe(size())
		.pipe(gulp.dest(paths.scripts.dest));
});

gulp.task('scripts-app', function() {
	return gulp.src(paths.scripts.files.app, {base: 'src'})
		.pipe(debug())
		.pipe(concat('bundle.js'))
		// .pipe(uglify())
		// .pipe(rename('bundle.min.js'))
		.pipe(size())
		.pipe(gulp.dest(paths.scripts.dest));
});


// LINTING
gulp.task('lint', function() {
	return gulp.src(paths.scripts.files.app)
		.pipe(eslint())
		.pipe(eslint.format('stylish'));
});


// STYLE TASK
gulp.task('styles', function (){
    gulp.src(paths.styles.files)
    	.pipe(debug())
	    .pipe(sass({
	        outputStyle: 'compressed',
	        includePaths : [paths.styles.src]
	    }))
	    .on('error', function(err) {
			gutil.log(gutil.colors.red('STYLE ERROR: ' + err.message));
			this.emit('end');
		})
	    .pipe(prefix('last 2 version', 'safari 5', 'ie 9', 'ios 6', 'android 4'))
	    .pipe(gulp.dest(paths.styles.dest))
	    .pipe(browserSync.stream({match: '**/*.css'}))
	    .pipe(size());
});


// WATCH TASK
gulp.task('watch', ['styles'], function() {

	browserSync.init({
		port: 3030,
        proxy: bsProxy
    });

	gulp.watch(paths.scripts.files.app, ['scripts-app', 'lint'])
		.on('change', function(e) {
			F._logger(e);
		});
	gulp.watch(paths.styles.files, ['styles'])
		.on('change', function(e) {
			F._logger(e);
		});
});
