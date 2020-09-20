
function mapFrom(min, max, t){
	if( max == min ){
		if(t == min) return 0
		if(t >  min) return +Infinity
		else         return -Infinity
	}
	return ( t - min ) / ( max - min )
}
function mapTo(min, max, t){
	return t * ( max - min ) + min
}

function logBase(base, v){
	return Math.log(v) / Math.log(base)
}

function gamma(base, t){
	return Math.pow(base, t)
}

function dBToRatio(db){
	return Math.pow(10, db/10)
}
function dBFromRatio(r){
	return 10 * Math.log10(r)
}

function memoize(fn){
	let mem
	return function(){
		if(mem === undefined) mem = fn()
		return mem
	}
}

function assign(object, defaults){
	Object.keys(defaults).forEach(function(k){
		object[k] = defaults[k]
	})
}

// Assign val if undefined
assign.defaults = function assignDefaults(object, defaults){
	Object.keys(defaults).forEach(function(k){
		if(object[k] === undefined) object[k] = defaults[k]
	})
}

// Assign val() if undefined
assign.defaultsGen = function assignDefaultsGen(object, defaults){
	Object.keys(defaults).forEach(function(k){
		if(object[k] === undefined) object[k] = defaults[k]()
	})
}

// Assign objectSource.val if defined, defaults.val() otherwise
// used to avoid modifying objectSource
assign.fillDefaultsGen = function (objectDest, objectSource, defaults){
	Object.keys(defaults).forEach(function(k){
		if(objectSource && objectSource[k] !== undefined)
			objectDest[k] = objectSource[k]
		else
			objectDest[k] = defaults[k]()
	})
}


module.exports = {
	mapFrom,
	mapTo,
	logBase,
	gamma,
	dB: {
		fromRatio: dBFromRatio,
		toRatio: dBToRatio
	},
	memoize,
	assign,
}
