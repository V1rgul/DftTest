let gnuplot = require("gnu-plot")
let utils = require("../src/utils")
let waves = require("./waves")

let dft = require("..")

let data = waves({
	duration: 10,
	samplingRate: [50,200],
	waves: [
		(t) => utils.dB.toRatio(-2) * waves.cosine(  2, 0.2)(t),
		(t) => utils.dB.toRatio(-5) * waves.cosine( 10, 0)(t),
	],
})

let result = dft(data)

let resultConverted = result.map((e) => [
	e[0],
	utils.dB.fromRatio(e[1]),
	(e[2]) / (Math.PI*2), // convert to turns,  [0;1]
])

// using converted results to find the peak works because:
// - same formatting
// - monotically increasing conversion applied to magnitude
let peaks = [dft.peak(resultConverted)]

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
	xlabel: "\"Frequency (Hz)\"",
	ylabel: "\"Magnitude (dB)\"",
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
