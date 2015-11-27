// To use gulp build:
//
// Install nodejs http://nodejs.org/
// `npm install -g gulp`
// `npm install` (from this directory to pull in build dependencies)
//
// Build:
//
// `gulp`
// 	
// `gulp karma`
//      Will watch JS files and run tests every time they are saved
//
// `gulp karma-ci`
//      Runs test suite once

var gulp = require("gulp"),
    karma = require("gulp-karma");



gulp.task("default", ["karma"]);


gulp.task("karma", function() {
    return gulp.src("./notreal")
        .pipe(karma({
            configFile : "karma.unit.conf.js",
            action : "run"
        }))
        .on("error", function(err) {
            throw err;
        });
});

//gulp.task("karma-ci", function() {
//    return gulp.src("./notreal")
//        .pipe(karma({
//            configFile : "karma.unit.conf.js",
//            action : "watch"
//        }))
//        .on("error", function(err) {
//            throw err;
//        });
//});


//gulp.task("karma-local", function () {
//	return gulp.src("./notreal")
//        .pipe(karma({
//        	configFile: "karma.local.unit.conf.js",
//        	action: "run"
//        }))
//        .on("error", function (err) {
//        	throw err;
//        });
//});
