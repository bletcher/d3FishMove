

 // some global variables //
    var maxSection=14,
        maxLength=220,
        timeSteps = 25,
        selectedID = [],
        inData,
        currentSample,
        sampSet = [],
        summarizeBySection,
        selectedRiver;
        
 // Global scale values       
    var xScale,
        yScale,
        xScale2,
        yScale2,
        yScale2Bar,
        radiusScale,
        colorScale,
        yAxis1;
        
 // set up svg element data //
    var w = 850,
		    h = 550,
		    xPadding = 40,
		    yPadding = 40,
		    tweenPadding = 10,
		    barPadding = 3;
		    
 // Bar variables	//	    
		 var barData = [],
		     barData2 = [],
		     barMultiplier,
		     barMultiplierCount = 4,
		     barMultiplierSumWt = 0.4,
		     barGreyBase,              // these could be replaced with scales
		     barGreyBaseCount = 200,
		     barGreyBaseSumWt = 250,
		     barGreyMult,
		     barGreyMultCount = 4,
		     barGreyMultSumWt = 0.4;


  //  var svg = d3.select("body")
  //    .append("svg")
  //    .attr("width",  w)
  //    .attr("height", h)
  //   ;
      


// Slider bar
  var sliderLabelsMaxNum = 20;
  var sampSetLegend;

/*
var label = d3.select("seasonLabel")
    .attr("class", "seasonLabel")
    .attr("text-anchor", "end")
  //  .attr("y", h-8)
  //  .attr("x", w-32)
    .text("test")
    ;
*/
