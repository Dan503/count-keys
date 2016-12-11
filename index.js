
import defaultTo from 'default-to';

export default function countKeys (obj, spec){
	spec = defaultTo(spec, {
		recursive: true,
		arrays: true,
		filter: (item) => true,
	});

	let count = 0;

	function raiseCount(thisObject, parent){
		let returnVal = count;

		thisObject = defaultTo(thisObject, {});

		for (const key in thisObject){
			const value = thisObject[key];

			if (thisObject.hasOwnProperty(key)){
				const arrayCheck = spec.arrays ? true : isNaN(parseInt(key));

				let filter = spec.filter.call(thisObject, { key, value, count, parent });
				filter = defaultTo(filter, true);

				if (filter && arrayCheck) count ++;

				if (spec.recursive && typeof value === 'object'){
					returnVal = raiseCount(value, thisObject);
				} else {
					returnVal = count;
				}
			}
		}

		return returnVal;
	}
	return raiseCount(obj);
}