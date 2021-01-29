function isObject(val){
	return val != null && typeof val === 'object' && Array.isArray(val) === false;
}
function isArray(val){
	return Array.isArray(val);
}

export {isObject,isArray}
