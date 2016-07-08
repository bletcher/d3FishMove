   var state = {
     dotOption: undefined,        //set in initializeState(), reset in initializeInterface()
     currentSample: undefined,
     onClick: undefined,
     addLastSample: undefined,
     nodes: [],
     nodesCurrent: [],
     nodesRender: [],
     sectionData: [],
     familyData: [],
     selectedID: [], 
     maxLength: undefined,
     maxSection: undefined,
     sampSet: [],
     seasonSet: [],
     yearSet: [],
     previousSample: undefined,
     propMoved: undefined
   };

var searchRadius = 5;

var minTimeStep,
    maxTimeStep;
    
var numFish = 100; 

var intervalDur = 200,
    strengthAdj = 0.95;

var colorScale =   d3.scaleOrdinal(d3.schemeCategory10),
    colorScale20 = d3.scaleOrdinal(d3.schemeCategory20);

// variable that holds the paths and coordinates for each start river/end river combo
var paths = [];
var nodesFirstSampleOnly;
var xy = [], byRiver = [], byFish = [];

var simulation;

var ageScale = d3.scaleOrdinal().domain(d3.range(5)).range([2,3,4,5,6]); //[1,1.5,2,2.5,3]
var seasonScale = d3.scaleOrdinal().domain(["Spring","Summer","Autumn","Winter"]).range([1,2,3,4]); 

var tooltip = d3.select("body")
  .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

// Slider bar
  var sliderLabelsMaxNum = 20;
  var sampSetLegend;

var propMoved;

var cd,cd2,envData;

var width, height;
