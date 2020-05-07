let windows = require("./windows")
let dft = require("./dft")
let utils = require("./utils")

function calcDataStats(data){
	let time  = data[0][0]
	let value = data[0][1]

	let stats = {
		value    : { min:    value, max: value },
		time     : { min:     time, max:  time },
		timeDelta: { min: Infinity },
	}

	let timeLast = time
	for(let i=1; i<data.length; i++){
		time  = data[i][0]
		if     (time < stats.time.min) stats.time.min = time
		else if(time > stats.time.max) stats.time.max = time

		value = data[i][1]
		if     (data < stats.value.min) stats.value.min = data
		else if(data > stats.value.max) stats.value.max = data

		let dt = time - timeLast
		if     (dt < stats.timeDelta.min) stats.timeDelta.min = dt
		timeLast = time
	}
	stats.duration = stats.time.max - stats.time.min
	return stats
}

function constructOptions(options, data, useConstructed){
	options = options || {}
	if(useConstructed && options.constructed) return options

	let dataStats = utils.memoize(() => calcDataStats(data))

	utils.assign.defaultsGen(options, {
		window        : () => windows.Taylor(),
		duration      : () => dataStats().duration,
		frequencies   : () => ({}),
	})

	if(!Array.isArray(options.frequencies.list)){
		utils.assign.defaultsGen(options.frequencies, {
			min    : () => 1/dataStats().duration,
			max    : () => (1/dataStats().timeDelta.min) / 2,
			number : () => 4096,
			logBase: () => 10,
		})

		options.frequencies.list = new Array(options.frequencies.number)
		let logMin = utils.logBase(options.frequencies.logBase, options.frequencies.min)
		let logMax = utils.logBase(options.frequencies.logBase, options.frequencies.max)
		for(let i=0; i<options.frequencies.number; i++){
			let tLinear = i/(options.frequencies.number-1)
			let tLog = utils.mapTo(logMin, logMax, tLinear)
			let f = Math.pow(options.frequencies.logBase, tLog)
			options.frequencies.list[i] = f
		}
	}

	options.constructed = true
	return options
}


function main(data, options){
	options = constructOptions(options, data, true)

	let dataWindowed = dft.doWindow(options, data)
	let dftResult = dft.doDft(options, dataWindowed)

	return dftResult
}

function peak(dftResult, options){
	let elemMax = [null, -Infinity]
	dftResult.forEach(function(d){
		if(d[1] > elemMax[1]){
			elemMax = d
		}
	})
	return elemMax
}


utils.assign(main, {
	constructOptions,
	windows,
	peak,
})

module.exports = main
