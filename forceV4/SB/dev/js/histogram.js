// get distMoved for each season for the movement dist graphs
// filter by selected spp
function updateDistMovedArr(){
  var hold = state.nodes;
  if( state.selectedSpecies != "all") { hold = getDataSpecies(state.nodes, state.selectedSpecies);}  
  if( state.onClick == "riv") { hold = getDataRiver(hold, state.selectedRiver);} 
  
  state.distMovedArr = [];   
  [1,2,3,4].forEach( function(s){
    var dat = [];
    hold.forEach(function(d,i){ 
      dat = dat.concat( removeFalsey( [getDistMovedBySeason(d,seasonScaleRev(s))] ) ); 
    });
    state.distMovedArr[s] = dat;
  });

}


function drawHistogram(){

  var sampData = getDataSample(envData, state.currentSample);
  var seasData = getDataSeason(envData,seasonScale(state.currentSeason));
 //  console.log("histo",envData, s, y);

  d3.select("#collapseTwo").selectAll("svg").remove();

  var data1 = seasData.map(function(d){return d.temp});
  var data2 = sampData.map(function(d){return d.temp});
  histo(data1,data2,"#collapseTwo");

  var data3 = seasData.map(function(d){return Math.log10(d.flow + 1)}); //blue
  var data4 = sampData.map(function(d){return Math.log10(d.flow + 1)}); //orange
  histo(data3, data4, "#collapseTwo");     

}

function histo(data,data2,divIn){
  var numTicks = 30;
  
  //https://bl.ocks.org/mbostock/3048450   
  var formatCount = d3.format(",.0f");
  
  var marginH = {top: 10, right: 30, bottom: 30, left: 30},
    widthH = 300 - marginH.left - marginH.right,
    heightH = 100 - marginH.top - marginH.bottom;

  var svg = d3.select(divIn).append("svg")
      .attr("width", widthH + marginH.left + marginH.right)
      .attr("height", heightH + marginH.top + marginH.bottom)
    .append("g")
      .attr("transform", "translate(" + marginH.left + "," + marginH.top + ")");
  
  //// for data1
  var x = d3.scaleLinear()
      .domain([d3.min(data),d3.max(data)])
      .rangeRound([0, widthH]);
  
  var bins = d3.histogram()
               .thresholds(x.ticks(numTicks))
               (data);
  
  var y = d3.scaleLinear()
      .domain([0, d3.max(bins, function(d) { return d.length; })])
      .range([heightH, 0]);

  var bar = svg.selectAll(".bar")
        .data(bins)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      ;
  
  bar.append("rect")
   //  .transition()
      .attr("x", 1)
      .attr("width", widthH/numTicks + 0)
      .attr("height", function(d) { return heightH - y(d.length); });


  
  var bins2 = d3.histogram()
               .thresholds(x.ticks(numTicks))
               (data2);
  
  var y2 = d3.scaleLinear()
      .domain([0, d3.max(bins2, function(d) { return d.length; })])
      .range([heightH, 0]);

  var bar2 = svg.selectAll(".bar2")
        .data(bins2)
      .enter().append("g")
        .attr("class", "bar2")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y2(d.length) + ")"; })
      ;
  
  bar2.append("rect")
   //  .transition()
      .attr("x", 1)
      .attr("width", widthH/numTicks + 0)
      .attr("height", function(d) { return heightH - y2(d.length); });

// 
  svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + heightH + ")")
      .call(d3.axisBottom(x));
      
}


////////////////////////
// Movement dist histos

function drawHistogramDistMoved(){

  d3.select("#collapseFour").selectAll("svg").remove();

  var sampData = state.nodesRender.map(function(d){return getDistMoved(d)});
  var seasData = getDataSeason(state.nodes,seasonScale(state.currentSeason)) ; // cdHold.map(function(d){return d.distMoved });

  var data1 = sampData;
  var data2=state.distMovedArr[seasonScale(state.currentSeason)];
 
  histoDistMoved(data1,data2,"#collapseFour");
  
  console.log("histo", data1,data2);
}

function histoDistMoved(data1,data2,divIn){
  var numTicks = 50;
  
  //https://bl.ocks.org/mbostock/3048450   
  var formatCount = d3.format(",.0f");
  
  var marginH = {top: 10, right: 30, bottom: 30, left: 30},
    widthH = 300 - marginH.left - marginH.right,
    heightH = 200 - marginH.top - marginH.bottom;

  var svg = d3.select(divIn).append("svg")
      .attr("width", widthH + marginH.left + marginH.right)
      .attr("height", heightH + marginH.top + marginH.bottom)
    .append("g")
      .attr("transform", "translate(" + marginH.left + "," + marginH.top + ")");
  
  
  //// for data1
  var x = d3.scaleLinear()
      .domain([d3.min(data1),d3.max(data1)])
      .rangeRound([0, widthH]);
  
  var bins = d3.histogram()
               .thresholds(x.ticks(numTicks))
               (data1);
  
  var y = d3.scaleLinear()
      .domain([0, d3.max(bins, function(d) { return d.length; })])
      .range([heightH, 0]);

  var bar = svg.selectAll(".bar")
        .data(bins)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      ;
  
  bar.append("rect")
   //  .transition()
      .attr("x", 1)
      .attr("width", widthH/numTicks + 0)
      .attr("height", function(d) { return heightH - y(d.length); });

/////////////
  var bins2 = d3.histogram()
               .thresholds(x.ticks(numTicks))
               (data2);
  
  var y2 = d3.scaleLinear()
      .domain([0, d3.max(bins2, function(d) { return d.length; })])
      .range([heightH, 0]);

  var bar2 = svg.selectAll(".bar2")
        .data(bins2)
      .enter().append("g")
        .attr("class", "bar2")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y2(d.length) + ")"; })
      ;
  
  bar2.append("rect")
   //  .transition()
      .attr("x", 1)
      .attr("width", widthH/numTicks + 0)
      .attr("height", function(d) { return heightH - y2(d.length); });

// 
  svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + heightH + ")")
      .call(d3.axisBottom(x));
}


