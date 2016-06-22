   var state = {
     selectedRiver: undefined,    //set in initializeState(), reset in initializeInterface()
     selectedSpecies: undefined,  //set in initializeState(), reset in initializeInterface()
     dotOption: undefined,        //set in initializeState(), reset in initializeInterface()
     barOption: undefined,        //set in initializeState(), reset in initializeInterface()     
     barVariable: undefined,      //set in initializeState(), reset in initializeInterface()
     currentSample: undefined,
     onClick: undefined,
     lines: undefined,
     nodes: [],
     nodesCurrent: [],
     nodesRender: [],
     sectionData: [],
 /*    allData: [],
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
 */  familyData: [],
     selectedID: [], //filter for these in render
     maxLength: undefined,
     maxSection: undefined,
     sampSet: []
   };



var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
//    width = canvas.width,
//    height = canvas.height,
    searchRadius = 5;

var timeStep,
    minTimeStep,
    maxTimeStep;
    
var numFish = 100;    

var intervalDur = 200,
    strengthAdj = 0.95;

var //color = d3.scaleCategory10();
      colorScale =   d3.scaleCategory10(),
      colorScale20 = d3.scaleCategory20();

// variable that holds the paths and coordinates for each start river/end river combo
var paths = [];// nodes, nodesCurrent, 
var nodesFirstSampleOnly;
var xy = [], byRiver = [], byFish = [];

var simulation;

// set up graphics
var margin = {top: 40, right: 40, bottom: 0, left: 40},
    width = canvas.width - margin.left - margin.right,
    height = canvas.height - margin.top - margin.bottom;

var xScale = d3.scaleLinear()
    .range([0,height - margin.top - margin.bottom]);
    
var yScale = d3.scaleLinear()
    .range([0,width - margin.left - margin.right]);
    
var ageScale = d3.scaleOrdinal().domain(d3.range(5)).range([2,3,4,5,6]); //[1,1.5,2,2.5,3]

var tooltip = d3.select("body")
  .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

