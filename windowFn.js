



function genTaylor(options){
	options = options || {}
	options.interpolationSteps   = options.interpolationSteps   || 256
	options.sidelobesNumber      = options.sidelobesNumber      ||   4 // How many sidelobes should be kept at attenuation
	options.sidelobesAttenuation = options.sidelobesAttenuation ||  35 // dB, attenuation

	let taylor = require('taylorwin')
	let taylorWindowArr = taylor(options.interpolationSteps, options.sidelobesNumber, options.sidelobesAttenuation)

	function interpolate(arr, t){
		if(t >= 1) return arr[arr.length-1]

		arrT = t * (arr.length-1)
		let i = Math.floor(arrT)
		let localT = arrT - i
		let r = (1-localT) * arr[i] + (localT) * arr[i+1]
		// console.log("interpolate", "t:", t, "arr.length:", arr.length, "arrT:", arrT, "i:", i, "localT:", localT, "[",arr[i], ",", arr[i+1], "] ->", r)
		return r
	}

	return function(t){
		return interpolate(taylorWindowArr, t)
	}
}

// See https://en.wikipedia.org/wiki/Window_function#Cosine-sum_windows
function cosineWindowFn(p){
	return function(t){
		return p.reduce(function(acc, alpha, i){
			var dir = (i%2) ? -1 : 1
			return acc += dir*alpha*Math.cos(t*2*Math.PI*i)
		}, 0) / p[0]
	}
}

function genTukey(options){
	options = options || {}
	options.alpha = options.alpha || .5
	let integral = options.alpha * 0.5 + (1-options.alpha) * 1.0
	let alpha_2 = options.alpha/2
	return function(t){
		let r
		if        ( t<alpha_2     ) {
			t = t/alpha_2
			r = 0.5 + 0.5 * Math.cos( (t-1) * Math.PI )
		} else if ( t<(1-alpha_2) ) {
			r = 1
		} else {
			t = (t-1)/alpha_2
			r = 0.5 + 0.5 * Math.cos( (t+1) * Math.PI )
		}
		return r / integral
	}
}




let windows = {
	// Door           : function(t){ return 1 },
	// Triangular     : function(t){ return 2  *( (t<.5) ? t*2 : (1-t)*2  ) },
	// Welch          : function(t){ return 1.5*( 1 - Math.pow( 2*t-1 , 2 ) ) },
	// Hann           : cosineWindowFn([0.5, 0.5]),
	// Hamming        : cosineWindowFn([25/46, 21/46]),
	// Blackman       : cosineWindowFn([7938/18608, 9240/18608, 1430/18608]),
	// Nuttal         : cosineWindowFn([0.355768, 0.487396, 0.144232, 0.012604]),
	// BlackmanNuttal : cosineWindowFn([0.3635819, 0.4891775, 0.1365995, 0.0106411]),
	// BlackmanHarris : cosineWindowFn([0.35875, 0.48829, 0.14128, 0.01168]),
	// FlatTop        : cosineWindowFn([0.21557895, 0.41663158, 0.277263158, 0.083578947, 0.006947368]),
	// Taylor         : genTaylor(),
	Tukey          : genTukey(),
}


module.exports = windows


// let points = Math.pow(2, 16)
// console.log("points:", points)
// let integrals = {}
// Object.keys(windows).forEach(function(k){
// 	let sum = 0
// 	for(let i=0; i<points; i++){
// 		let t = i/points
// 		sum += windows[k](t)
// 	}

// 	integrals[k] = sum / points
// })
// console.log(integrals)
