
function mapFrom(v, rangeIn) {
	return (v - rangeIn[0]) / (rangeIn[1] - rangeIn[0])
}

function mapTo(v, rangeOut) {
	return v * (rangeOut[1] - rangeOut[0]) + rangeOut[0];
}

function map(v, rangeIn, rangeOut) {
	return mapTo(mapFrom(v, rangeIn), rangeOut)
}



module.exports = {
	mapFrom,
	mapTo,
	map
}
