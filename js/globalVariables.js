 // data //
   var inData; // check to see if still needed
       
   var state = {
     selectedRiver: undefined,    //set in initializeState(), reset in initializeInterface()
     selectedSpecies: undefined,  //set in initializeState(), reset in initializeInterface()
     dotOption: undefined,        //set in initializeState(), reset in initializeInterface()
     barOption: undefined,        //set in initializeState(), reset in initializeInterface()     
     barVariable: undefined,      //set in initializeState(), reset in initializeInterface()
     currentSample: undefined,
     onClick: undefined,
     lines: undefined,
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
     allSamplesSelected: [],
     aliveSamplesSelected: [],
     filteredAliveSamplesSelected: [],
     familyData: [],
     selectedID: [], //filter for these in render
     maxLength: undefined,
     maxSection: undefined,
     sampSet: [],
   };
   
   var svg1,svg2,tip,tipBar;

 // some global variables //
    var sampSet = [],
        summarizeBySection,
        selectedPaths
        ;
        
/*    var arrForPath = {
      id: [],
      samples: {}
    };
    arrForPath.samples.xx = [];
    arrForPath.samples.yy = [];    
*/    
        
 // Global scale values       
    var xScale,
        yScale,
        xScale2,
        yScale2,
        yScale2Bar,
        radiusScale,
        colorScale,
        colorScale = d3.scale.category10(),
        colorScale20 = d3.scale.category20(),
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
	     barGreyBase,             
	     barGreyBaseCount = 200,
	     barGreyBaseSumWt = 250,
	     barGreyMult,
	     barGreyMultCount = 0.1,
	     barGreyMultSumWt = 0.1;

// Slider bar
  var sliderLabelsMaxNum = 20;
  var sampSetLegend;
