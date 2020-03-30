
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

function logB(base, v){
	return Math.log(v) / Math.log(base)
}

function gamma(base, t){
	return Math.pow(base, t)
}


module.exports = {
	mapFrom,
	mapTo,
	logB,
	gamma
}
