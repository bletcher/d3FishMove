var state = {
  forceX: undefined,
  forceY: undefined,
  nodes: undefined,
  counts: []
};

var xy, posVar, xPos, yPos;

var byFish;

var spp, riv, sea, yea;
    
var fishPerCircle = 25;

var csvIn = {};

var uniqueYears, stepWidth, uniqueSeasons, stepHeight;

var initialRadius = 3;

var searchRadius = 5;

var tooltip = d3.select("body")
  .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");


