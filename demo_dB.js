let gnuplot = require("gnu-plot")
let utils = require("./utils")
let dft = require(".")


let waves = require("./waves")
let results = dft(waves)

let resultConverted = results.map((e) => [
	e[0],
	utils.dB.fromRatio(e[1]),
	(e[2]+Math.PI) / (Math.PI*2), // convert to turns,  [0;1]
])

// using converted results to find the peak works because:
// - same formatting
// - monotically increasing conversion applied to magnitude
let peaks = dft.peaks(resultConverted)

peaks.forEach(function (p, id){
	console.log(
		"Peak #"+id,
		"\n\tFrequency:", p[0], "Hz",
		"\n\tMagnitude:", p[1], "dB",
		"\n\tPhase    :", p[2], "turns",
	)
})

let plotF = gnuplot()
plotF.set({
	xlabel: "\"Hz\"",
	ylabel: "\"dB\"",
	logscale:"x 10",
}).plot([
	{
		data: resultConverted,
	},{
		title: "peak",
		style: "points",
		data: peaks,
	}
])
