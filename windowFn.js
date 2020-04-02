
function interpolate(arr, t){
	if(t >= 1) return arr[arr.length-1]

	arrT = t * (arr.length-1)
	var i = Math.floor(arrT)
	var localT = arrT - i
	var r = (1-localT) * arr[i] + (localT) * arr[i+1]
	// console.log("interpolate", "t:", t, "arr.length:", arr.length, "arrT:", arrT, "i:", i, "localT:", localT, "[",arr[i], ",", arr[i+1], "] ->", r)
	return r
}

var taylor = require('taylorwin');
function taylorWindowFn(n, nbar, sll){
	var taylorWindowArr = taylor(n, nbar, sll)
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

function tukeyWindowFn(alpha){ return function(t){
	let r
	if        (t<alpha/2) {
		r = 0.5+0.5*Math.cos( Math.PI*( 2*t/alpha-1 ) )
	} else if (t<(1-alpha/2)) {
		r = 1
	} else {
		r =  0.5+0.5*Math.cos( Math.PI*( (2*(t-1))/alpha + 1 ) )
	}
	return r * 4/3

} }




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
	Taylor         : taylorWindowFn(256, 4, 35),
	// Tukey          : tukeyWindowFn(0.5),
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
