let windows = require("./windows")
let dft = require("./dft")
let utils = require("./utils")


function dataFindMinimumTimeDelta(data){
	let minTimeDelta = Infinity
	let timeLast = data[0][0]
	for(let i=1; i<data.length; i++){
		let time = data[i][0]
		let dt = time - timeLast
		if(dt < minTimeDelta) minTimeDelta = dt
		timeLast = time
	}
	return minTimeDelta
}

function constructOptions(data, optionsUser, useConstructed){
	optionsUser = optionsUser || {}
	if(useConstructed && optionsUser.constructed) return optionsUser

	let options = {}
	utils.assign.fillDefaultsGen(options, optionsUser, {
		window: () => windows.Taylor(),
	})

	options.frequencies = {
		list: (optionsUser.frequencies && optionsUser.frequencies.list) || {}
	}
	if(!Array.isArray(options.frequencies.list)){
		utils.assign.fillDefaultsGen(options.frequencies, optionsUser.frequencies, {
			min    : function(){
				let duration = data[data.length-1][0] - data[0][0]
				return 1/duration
			},
			max    : () => (1/dataFindMinimumTimeDelta(data)) / 2,
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


function main(data, optionsUser){
	options = constructOptions(data, optionsUser, true)

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
