'use strict';

import gulp from 'gulp';
import pjson from './package.json';
import countKeys from './index';

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

	console.log('\nresult:', countKeys(object),'\n');

});
