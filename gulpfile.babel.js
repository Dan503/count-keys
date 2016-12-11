'use strict';

import gulp from 'gulp';
import pjson from './package.json';
import countKeys from './index';

import bumpTasks from './gulp/bump';
bumpTasks();

// Default task to test the function
gulp.task('default', ()=>{

	var object = {
		one: {
			two : 'string',
			three : {
				four: ['five', 'six']
			}
		},
		seven: 'string',
		eight: {
			nine : 'string',
		}
	}

	console.log('\nresult:', countKeys(object, {
		arrays: true,
		recursive: true,
		filter(item){
			// available values in "item":
			// item.key, item.value, item.count, item.parent

			//if (item.value === 'string') return false;

			//filter defaults to true if it returns 'undefined'
		}
	}),'\n');

});
