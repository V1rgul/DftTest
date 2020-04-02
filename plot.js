let gnuplot = require('gnu-plot')



let colors = (function (){
	let list = ["dark-violet","#009e73","#56b4e9","#e69f00","#f0e442","#0072b2","#e51e10","black","gray50"]
	let o = {}
	list.forEach(function(c, i){
		o["linetype "+(i+1)] = "lc rgb \""+c+"\""
	})
	o["linetype"] = "cycle "+list.length
	return o
})()


function plotWindows(o){
	let plotT = gnuplot()
	plotT.set(colors)
	plotT.plot(o)
	return plotT
}







function plotFreq(curves, maximums){
	let plotF = gnuplot()
	plotF.set(colors)
	//plotF.set({yrange:"[0:]"})
	plotF.set({logscale:"x 10"})
	// plotF.set({logscale:"y 10"})
	plotF.set({
		xlabel: "\"Hz\"",
		ylabel: "\"dB\"",
	})

	plotF.plot( curves.concat(maximums) )
}







function plotPhase(curves, maximums){
	let plotP = gnuplot()
	//plotP.set(colors)
	plotP.set({
		xlabel: "\"Hz\"",
		ylabel: "\"Phase %\"",
	})
	plotP.plot( curves.concat(maximums) )
}





module.exports = {
	plotWindows,
	plotFreq,
	plotPhase,
}
