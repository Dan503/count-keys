'use strict';

// dependencies
import gulp from 'gulp';
import git from 'gulp-git';
import bump from 'gulp-bump';
import filter from 'gulp-filter';
import tag_version from 'gulp-tag-version';
import minimist from 'minimist';
import babel from 'gulp-babel';
import rename from 'gulp-rename';

const args = minimist(process.argv.slice(2));

/**
 * SIMPLE VERSION BUMPING
 *
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp bump --patch   # makes v0.1.0 → v0.1.1
 *     gulp bump --minor   # makes v0.1.1 → v0.2.0
 *     gulp bump --major   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible change.
 *
**/

/**
 * GIT RELEASES
 *
 * You can use the commands to start the release
 *
 *     gulp start-release           # no version number change
 *     gulp start-release --patch   # makes v0.1.0 → v0.1.1
 *     gulp start-release --minor   # makes v0.1.1 → v0.2.0
 *     gulp start-release --major   # makes v0.2.1 → v1.0.0
 *
 * This will [optionally] bump the version number then babelify the src.js file to make it npm friendly
 * The file will then be ready to npm publish.
 *
 * To finish the release run:
 *
 *     gulp finish-release
 */

export default function() {

	function getBumpType(){
		if (args.patch && args.minor ||	args.minor && args.major ||	args.major && args.patch) {
			throw '\nYou can not use more than one version bump type at a time\n';
		}

		if (args.patch){
			return 'patch';
		} else if (args.minor){
			return 'minor';
		} else if (args.major) {
			return 'major';
		} else {
			return false;
		}
	}

	function checkError(err){
		if (err) throw err;
	}

	//bump the version number in package.json then commit and tag in git
	function versionBump(importance){
		if (!importance) throw `\nAn importance must be specified for a version bump to occur.
Valid importances: "--patch", "--minor", "--major"\n`;
		// get all the files to bump version in
		gulp.src(['./package.json', './bower.json'])
			// bump the version number in those files
			.pipe(bump({type: importance}))
			// save it back to filesystem
			.pipe(gulp.dest('./'))
			//read only one file to get the version number
			.pipe(filter('package.json'))
			//commit the changed version number
			.pipe(git.commit(`${importance} version bump`))
			// **tag it in the repository**
			.pipe(tag_version());
	}

	//Do the first half of a Git Flow release
	function startRelease(importance) {
		const releaseBranch = 'release/version-update';

		//creates new release branch
		git.checkout(releaseBranch, {args:'-b'}, (err)=>{
			checkError(err);

			gulp.src('./src.js')
				.pipe(babel())
				.pipe(rename('index.js'))
				.pipe(gulp.dest('./'))
				.on('end', ()=>{
					gulp.src('./index.js')
						.pipe(git.commit('Bebelified src.js'))
						.on('end',()=>{
							//increments the version number
							if (importance !== false) versionBump(importance);

							setTimeout(()=> console.log('\n  Now run "npm publish"\n'), 500);

						})
				});

		});
	}

	function finishRelease(){
		//checkout master branch
		git.checkout('master', (err)=>{
			checkError(err);
			//merge releaseBranch into master
			git.merge(releaseBranch, {args:'--no-ff'}, (err)=>{
				checkError(err);
				//check out develop branch
				git.checkout('develop', (err)=>{
					checkError(err);
					//merge release branch into develop
					git.merge(releaseBranch, {args:'--no-ff'}, (err)=>{
						checkError(err);
						//delete the release branch
						git.branch(releaseBranch, {args:'-d'});
					});
				});
			});
		});
	}

	gulp.task('bump', function(){
		return versionBump(getBumpType());
	});

	gulp.task('start-release', function(){
		return startRelease(getBumpType());
	});

	gulp.task('finish-release', function(){
		return finishRelease();
	});

}
