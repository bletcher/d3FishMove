 // data //
   var inData; // check to see if still needed
       
   var state = {
     selectedRiver: undefined,    //set in initializeState(), reset in initializeInterface()
     selectedSpecies: undefined,  //set in initializeState(), reset in initializeInterface()
     dotOption: undefined,        //set in initializeState(), reset in initializeInterface()
     barOption: undefined,        //set in initializeState(), reset in initializeInterface()     
     barVariable: undefined,      //set in initializeState(), reset in initializeInterface()
     currentSample: undefined,
     allData: [],
     riverData: [],
     speciesData: [],
     riverSpeciesData: [],
     renderData: [],
     renderData2: [],
     barData1: [],
     barData2: [],
     currentSampleDataAll: [],
     previousSampleDataAll: [],
     currentSampleDataSelected: [],
     previousSampleDataSelected: [],
     selectedID: [], //filter for these in render
     maxLength: undefined,
     maxSection: undefined,
     sampSet: [],
   };
   
   var svg1,svg2,tip,tipBar;

 // some global variables //
    var sampSet = [],
        summarizeBySection
        ;
        
 // Global scale values       
    var xScale,
        yScale,
        xScale2,
        yScale2,
        yScale2Bar,
        radiusScale,
        colorScale,
        xAxis1,
        yAxis1,
        maxSection,
        maxLength;
        
 // set up svg element data //
    var w = 500,
		    h = 500,
		    xPadding = 40,
		    yPadding = 40,
		    tweenPadding = 10,
		    barPadding = 3;
		    
// Bar variables	//	    
	 var barData = [],
	     barData2 = [],
	     barMultiplier,
	     barScale1,
	     barScale2,
	     maxBarRange = 125,
	     barGreyBase,              // these could be replaced with scales
	     barGreyBaseCount = 200,
	     barGreyBaseSumWt = 250,
	     barGreyMult,
	     barGreyMultCount = 4,
	     barGreyMultSumWt = 0.4;

// Slider bar
  var sliderLabelsMaxNum = 20;
  var sampSetLegend;
