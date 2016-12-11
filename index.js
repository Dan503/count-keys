
import defaultTo from 'default-to';

//Method that counts the total number of keys in objects and arrays including nested ones

/*
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

countItems(object) = 9
countItems(object, { arrays: false }) = 7
countItems(object, { recursive: false }) = 3

*/


export default function countItems (obj, spec){
	spec = defaultTo(spec, {
		recursive: true,
		arrays: true,
		filter: (key, value, parent) => true,
	});

	let count = 0;

	function raiseCount(thisObject, parent){
		let returnVal = count;

		thisObject = defaultTo(thisObject, {});

		const isArray = thisObject.constructor === Array;

		if (isArray && spec.arrays || !isArray && !spec.arrays){
			for (const key in thisObject){
				const value = thisObject[key];


				if (thisObject.hasOwnProperty(property)){

					const filter = spec.filter.call(key, { key, value, count, parent });

					if (filter) count ++;

					if (spec.recursive && typeof value === 'object'){
						returnVal = raiseCount(value, thisObject);
					} else {
						returnVal = count;
					}
				}
			}
		}

		return returnVal;
	}
	return raiseCount(obj);
}