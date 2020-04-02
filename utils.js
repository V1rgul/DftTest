
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

function dBtoRatio(db){
	return Math.pow(10, db/10)
}
function ratioToDB(r){
	return 10 * Math.log10(r)
}


module.exports = {
	mapFrom,
	mapTo,
	logB,
	gamma,
	dB: {
		fromRatio: ratioToDB,
		toRatio: dBtoRatio
	}
}

// console.log(" 10db = ", dBtoRatio( 10))
// console.log("  0db = ", dBtoRatio(  0))
// console.log("-10db = ", dBtoRatio(-10))

// console.log(" 10   = ", ratioToDB(10  ), "dB")
// console.log("  1   = ", ratioToDB( 1  ), "dB")
// console.log("  0.1 = ", ratioToDB( 0.1), "dB")
