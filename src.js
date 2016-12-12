
import defaultTo from 'default-to';

export default function countKeys (obj, spec){
	spec = defaultTo(spec, {
		recursive: true,
		arrays: true,
		filter: (item) => true,
		maxDepth: 'none',
	});

	let count = 0;

	function raiseCount(thisObject, parent, depth){
		let returnVal = count;


		thisObject = defaultTo(thisObject, {});

		for (const key in thisObject){

			if (thisObject.hasOwnProperty(key)){
				const value = thisObject[key];

				const arrayCheck = spec.arrays ? true : isNaN(parseInt(key));

				let filter = spec.filter.call(thisObject, { key, value, count, parent, depth });
				filter = defaultTo(filter, true);

				if (filter && arrayCheck) count ++;

				const isUnderMaxDepth = isNaN(spec.maxDepth) ? true : depth < spec.maxDepth;
				const isRecursive = spec.recursive && typeof value === 'object';

				if (isUnderMaxDepth && isRecursive){
					returnVal = raiseCount(value, thisObject, depth + 1);
				} else {
					returnVal = count;
				}
			}
		}

		return returnVal;
	}
	return raiseCount(obj, false, 1);
}