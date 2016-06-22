// inputting data
    function type(d){
      d.lat = +d.lat;
      d.lon = +d.lon;
      d.section = +d.section;
      d.sectionN = +d.sectionN;
      d.riverN = +d.riverN;
      d.tTrib = +d.terminalTrib;
      return d;
    }

    function typeCoreData(d){
      d.sample = +d.sample;
      d.date = Date.parse(d.date);
      d.id = +d.id;
      d.section = +d.section;
      d.len = +d.len;
      d.wt = +d.wt;
      d.enc = +d.enc;
      d.moveDir = +d.moveDir;
      d.distMoved = +d.distMoved;
      d.lagSection = +d.lagSection;
      d.season = d.seasonStr;
      d.year = +d.year;
      d.cohortFamilyID = d.cohortFamilyID;
      d.familyID = +d.familyID;
      d.minSample = +d.minSample;
      d.maxSample = +d.maxSample;
      d.familyCount = +d.familyCount;
      d.riverAbbr = d.river;
      d.age = +d.age;
      return d;
    }

function color(d){ return d.id; }

         function initializeState() {
           console.log('initializeState()');
 /*          state.selectedRiver = $("#selectedRiverDD").val();
           state.selectedSpecies = $("#selectedSpeciesDD").val();
      */     state.dotOption = $("#dotOptionDD").val();   
     //      state.barOption = $("#barOptionDD").val();
        //   state.barVariable = $("#barVariableDD").val();
           state.onClick = $("#onClickDD").val();
   //        state.lines = $("#linesDD").val();
           console.log('state: ', state);
         }
         
         function initializeInterface() {
           console.log('initializeInterface()');
           
 /*          $("#selectedSpeciesDD").on("change", function () {
            console.log("#selectedspeciesDD change");
            state.selectedSpecies = $("#selectedSpeciesDD").val();
            updateRiverSpecies(state);
            ticked();
           });
           $("#selectedRiverDD").on("change", function () {
            console.log("#selectedRiverDD change");
            state.selectedRiver = $("#selectedRiverDD").val();
            updateRiverSpecies(state);
            ticked();
           });
    */       $("#unselectAll").on("click", function () {
             console.log("#unselectAll click");
             resetColors();
             state.selectedID = [];
             updateRenderData();
             ticked();
           });
           $("#dotOptionDD").on("change", function () {
             console.log("#dotOption change");
             state.dotOption = $("#dotOptionDD").val();
        //     resetColors();
        //     state.selectedID = [];
             updateRenderData();
             ticked();
           });
/*
           $("#barOptionDD").on("change", function () {
             console.log("#barOption change");
             state.barOption = $("#barOptionDD").val();
             ticked();
           });
           $("#barVariableDD").on("change", function () {
             console.log("#barVariableDD change");
             state.barVariable = $("#barVariableDD").val();
             ticked();
           });
  */         $("#onClickDD").on("change", function () {
             console.log("#onClickDD change");
             state.onClick = $("#onClickDD").val();
             resetColorsToSpp();
             state.selectedID = [];
             updateRenderData();
             ticked();
           });
  /*        $("#linesDD").on("change", function () {
             console.log("#linesDD change");
             state.lines = $("#linesDD").val();
             ticked();
           });
  */       }



function initializeNetwork(xyIn){
  console.log("initializeNetwork");
    ////////////////////////////////////////////////////////////////////////////
    // set up xy coordinates from csv file
    byRiver = d3.nest()
                .key(function(d){return d.riverN;}).sortKeys(d3.ascending)
                .entries(xyIn); 
  
    xy = byRiver.map(function (d) {
                 return {
                   riverN: Number(d.key),
                   coordinates: d.values.map(function(dd) {
                     return [dd.lat,dd.lon];
                   }),
                   minSection: d3.min( d.values.map(function(dd) { return dd.section; }) ),
                   maxSection: d3.max( d.values.map(function(dd) { return dd.section; }) )
                 };
               }); 
               
    console.log("byRiver/xy",byRiver,xy); 
  
    getPathsCoords(xy,nextDown,terminalTrib);
}


function initializeFishData(cd,xyIn){
    console.log("initializefishData");
    // massage fish data
    minTimeStep =    d3.min(cd, function(d) { return d.sample; }) - 1;
    state.currentSample = minTimeStep+1;
    maxTimeStep = d3.max(cd, function(d) { return d.sample; });
    console.log("timeStep",state.currentSample,maxTimeStep);
    
    state.sampSet = sortUnique( cd.map( function(d){ return d.sample; }) );
    console.log("sampSet",state.sampSet);
    
    assignSectionN(cd,xyIn);
    
    byFish = d3.nest()
               .key(function(d){return d.id;}).sortKeys(d3.ascending)
               .entries(cd);
  
    var spp = uniques( cd.map( function(d) {return d.species}) ); // array of unique species
    console.log("spp",spp);
    
    state.nodes = byFish.map(function (d) {
                 return {
                   id: d.values[0].id,
                   riverN: d.values.map(function(dd) {
                     return dd.riverN;
                   }),
                   river: d.values.map(function(dd) {
                     return dd.river;
                   }),
                   section: d.values.map(function(dd) {
                     return dd.section;
                   }),
                   sectionN: d.values.map(function(dd) {
                     return dd.sectionN;
                   }),
                   sample: d.values.map(function(dd) {
                     return dd.sample;
                   }),
                   len: d.values.map(function(dd) {
                     return dd.len;
                   }),
                   age: d.values.map(function(dd) {
                     return dd.age;
                   }),
                   year: d.values.map(function(dd) {
                     return dd.year;
                   }),
                   season: d.values.map(function(dd) {
                     return dd.season;
                   }),
                   species: d.values[0].species,
                   speciesIndex: spp.indexOf(d.values[0].species), // integer value of spp
                   color: colorScale( spp.indexOf(d.values[0].species) ),
                   familyID: d.values[0].familyID
                 };
               });
  
  state.nodes.forEach( function(d){ d.firstSample = d.sample[0]; } );
}

function incrementSegments(){
  
  var indexSegNum = 0;
  var intDur = state.currentSample == minTimeStep ? 2 : intervalDur; //probably not needed now
  
  // increment segments until all fish have moved
  var intervalNum = setInterval(function(){ 
       indexSegNum = indexSegNum + 1;
       
       var indexNumDone = 0;
       
       state.nodesRender.forEach(function (d,i) {
         if(indexSegNum < d.nodePath.length){
           d.coordinate = d.nodePath[indexSegNum];
         }
         else { 
           d.coordinate = d.coordinate;
           indexNumDone = indexNumDone + 1;
         }

       });
       
       console.log("Prop done moving", indexNumDone/state.nodesRender.length, state.currentSample);
       $("#propDoneLabel").html((indexNumDone/state.nodesRender.length).toFixed(2));
       $("#simAlphaLabel").html(simulation.alpha().toFixed(2));
       
       var aMin = state.currentSample == minTimeStep ? 0.00001 : 0.01;
       simulation.alpha(1).alphaMin(aMin).nodes(state.nodesRender).restart(); //alphaMin > 0 shortens the simulation - keeps the dots from jiggling near end as they find the packing solution

       if (state.nodesRender.length === 0 || indexNumDone/state.nodesRender.length == 1) clearInterval(intervalNum);
       
   },intDur);
  
}

function ticked() {
//  console.log(state.currentSample,simulation.alpha())
  
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.translate(margin.left, margin.top); // subtract the margin values whenever use simulation.find()

  context.beginPath();
  xy.forEach(drawcoordinate);
  context.fillStyle = "#bbb";
  context.fill();
  context.strokeStyle = "#bbb";
  context.stroke();

  state.nodesRender.forEach(drawNode);

  context.restore();
}


function drawcoordinate (d, i) {
  d.coordinates.forEach( function (dd,ii) {
    context.moveTo(xScale(dd[0]), yScale(dd[1]));
    context.arc(   xScale(dd[0]), yScale(dd[1]), 10, 0, 2 * Math.PI);
  });
}

function drawNode (d, i) {

  context.beginPath();
        
  context.moveTo(d.x, d.y );

  if( d.isFirstSample && simulation.alpha() < 0.2 ){  // keep new fish from entering from the upper left
    context.arc(   d.x, d.y, ageScale(d.currentAge)*(1-simulation.alpha()/0.2), 0, 2 * Math.PI);

    if(!IDinSelectedID(state.selectedID,d.id)) {  
      context.strokeStyle = d.color;
      context.stroke();
    }
    else {
      context.strokeStyle = "black";
      context.stroke();      
    }
    
    context.fillStyle = d.color;
    context.fill();
  }  
  else if (!d.isFirstSample) {
    
    context.arc(d.x, d.y, ageScale(d.currentAge), 0, 2 * Math.PI);

    if(!IDinSelectedID(state.selectedID,d.id)) {  
      context.strokeStyle = d.color;
      context.stroke();
    }
    else {
      context.strokeStyle = "black";
      context.stroke();    
      context.linewidth = 4;
      context.stroke();
    }
    
    context.fillStyle = d.color;
    context.fill();
  } 
  
//  if(d.once){
//    context.strokeStyle = "black";
//    context.stroke();
//  }

}


function getNodesCurrent(){
  
  nodesFirstSampleOnly = state.nodes.filter( function(d) { return d.sample.includes( state.currentSample ) && d.sample.length == 1 });
  getPathFirstOnly(nodesFirstSampleOnly);
  
  nodesCurrentTmp = state.nodes.filter( function(d) { return d.sample.includes( state.currentSample ) && d.sample.includes( state.currentSample + 1 ) });
  getPath(nodesCurrentTmp);
  
  state.nodesCurrent = nodesCurrentTmp.concat(nodesFirstSampleOnly);
  
//  console.log("nodes length",state.nodesCurrent.length);
  
  state.nodesCurrent.forEach(function(d){ d.coordinate = d.pathEnd;//d.pathStart;
                                          d.isFirstSample = (d.firstSample == state.currentSample ); 
                                        });

//  console.log("nodesCurrent",state.currentSample,state.nodesCurrent);
}

function selectedIDIsNotAlive(){
  state.selectedID.forEach( function(d){
    console.log("selectedIsAlive",d);
    if( !state.nodesRender.map(function(d){ return d.id }).includes(d) ){ console.log("selectedIsNOTAlive",d);state.selectedID.splice(state.selectedID.indexOf(d),1)  }
  });
}

function getNodesRender(){
  if ( state.dotOption == "all" ) { state.nodesRender = state.nodesCurrent; }
  else if ( state.dotOption == "selected" ) { state.nodesRender = getSelected(state.nodesCurrent); }
}

function updateRenderData(){
  
  getNodesCurrent();
  state.nodesCurrent.forEach(function(d) { updateCurrentAge(d); });
  getNodesRender();
  
  state.nodesCurrent.forEach(function(d) { updateCurrentSeason(d); });
  state.nodesCurrent.forEach(function(d) { updateCurrentYear(d); });
  $("#seasonLabel").html(state.nodesCurrent[0].currentSeason);
  $("#yearLabel").html(state.nodesCurrent[0].currentYear);
  
}

function updateCurrentAge(d){
   var indx = d.sample.indexOf(state.currentSample); 
       d.currentAge = d.age[indx];
}

function updateCurrentSeason(d){
   var indx = d.sample.indexOf(state.currentSample); 
       d.currentSeason = d.season[indx];
}

function updateCurrentYear(d){
   var indx = d.sample.indexOf(state.currentSample); 
       d.currentYear = d.year[indx];
}

  function resetColors(){  //this resets colors of all decsendents of nodes; nodesCurrent, nodesRender
    state.selectedID.forEach( function(d){ getDataID(state.nodes,       d)[0].color = colorScale( getDataID(state.nodes,d)[0].speciesIndex ); } );
   // state.selectedID.forEach ( function(d){console.log("reset colors",d); getDataID(state.nodesCurrent,d)[0].color = colorScale( getDataID(state.nodes,d)[0].speciesIndex ); } );
  }
  
  function resetColorsToSpp(){  //this resets colors of all decsendents of nodes; nodesCurrent, nodesRender
    state.nodes.forEach( function(d){ d.color = colorScale( d.speciesIndex ); } );
  }


  function clickSubject() {
    console.log("mouseClickSubject",d3.event.x,d3.event.y,simulation.find(d3.event.x - margin.left, d3.event.y - margin.top, searchRadius));
    return simulation.find(d3.event.x - margin.left, d3.event.y - margin.top, searchRadius);
  }

   function clickDot(){

     var d = clickSubject();
     console.log("selected",d.id);
     
     // select an individual circle when clicked 
     if (state.onClick == "ind") {

       // Empty selectedID array
   //    state.selectedID = [];

       // selecting new point
       if ( !IDinSelectedID( state.selectedID,d.id ) ){
         state.selectedID.push(d.id);
         console.log("selected",state.selectedID);
   //      getDataID(state.nodes,d.id)[0].color = colorScale20( d.id );              ///could update nodes just before next state.currentSample
         getDataID(state.nodesRender,d.id)[0].color = colorScale20( d.id );
       }
       
       // unselect existing selected ID
       else if ( IDinSelectedID(state.selectedID,d.id) ){
         unSelectThisOne(d);
         console.log("UNselected",state.selectedID);
   //      getDataID(state.nodes,d.id)[0].color = colorScale( d.speciesIndex );
         getDataID(state.nodesRender,d.id)[0].color = colorScale( d.speciesIndex );
       }
     }
     
     else if (state.onClick == "sec") {

       resetColors();
       
       // Empty selectedID array
       state.selectedID = [];
       
       // get all data from the section of the selected individual
       state.sectionData = getDataSection(state.nodesRender,d.coordinate);
       console.log(state.sectionData, d.coordinate)
       // Add ID's of the selected fish's family to selectedID
       state.selectedID = state.sectionData.map( function(d){ return(d.id) } );
       
       state.selectedID.forEach ( function(d){ //getDataID(state.nodesCurrent, d)[0].color = colorScale20( d ); 
                                               getDataID(state.nodesRender,  d)[0].color = colorScale20( d );
                                             });
       
       console.log("section",state.selectedID, getDataSample(state.sectionData,state.currentSample)//.map(function(d) {return d.section}) 
       );
        
     }
     // Select IDs of all individuals in the selected individual's family
     else if (state.onClick == "fam") {

      //resetColors();
       state.nodes.forEach(function(d){d.color="lightgrey"})
       
       // Empty selectedID array
       state.selectedID = [];
       
       // get all data from the family of the selected individual
       state.familyData = getDataFamily(state.nodesRender,d.familyID);
       // Add ID's of the selected fish's family to selectedID
       state.selectedID = state.familyData.map( function(d){ return(d.id) } );
       
    //   state.selectedID.forEach ( function(d){ getDataID(state.nodes,       d)[0].color = colorScale20( d ); } );
       state.selectedID.forEach ( function(d){ getDataID(state.nodesRender,d)[0].color = colorScale20( d ); } );
       
        console.log("family",state.selectedID);
       
     }
     
     updateRenderData();
     ticked();
   }
   
  // Is id in selectedID array?
  function IDinSelectedID(arr, val) {
    return arr.some(function(arrVal) {
      return val === arrVal;
    });
  }
  
  function unSelectThisOne(d){ 
    state.selectedID.splice(state.selectedID.indexOf(d.id),1);
  }

  function getDataSection(d,coord){
    return d.filter( function(dd) {
      return dd.coordinate == coord;
    });
  }
  
  function getDataFamily(d,famID){
    return d.filter( function(dd) {
      return dd.familyID == famID;
    });
  }

  function getDataID(d,id) {
    return d.filter( function(d) {
      return d.id == id;
    });
  }

  function getSelected(dd) {
    return dd.filter( function(d) {
      return IDinSelectedID(state.selectedID,d.id);
    });
  }

  function getDataSample(dd,s) {
    return dd.filter( function(d) {
      return d.sample.includes(s);
    });
  }

function uniques(array) {
   return Array.from(new Set(array));
}

    function sortUnique(arr) {
        arr.sort();
        var last_i;
        for (var i=0;i<arr.length;i++)
            if ((last_i = arr.lastIndexOf(arr[i])) !== i)
                arr.splice(i+1, last_i-i);
        return arr;
    }

function assignSectionN(cd,xyIn){
// assign sectionN based on riverAbbr and section# 
// need to check lat/lon sor sections -1 and 0 in OS - just subtracted from the last decimal for now
  cd.forEach(function (d,i) {
    d.sectionN = xyIn.filter( function(dd) { return d.riverAbbr == dd.riverAbbr && d.section == dd.section })[0].sectionN;
    d.riverN =   xyIn.filter( function(dd) { return d.riverAbbr == dd.riverAbbr && d.section == dd.section })[0].riverN;
  
  });
}

function getPathsCoords(xy,nextDown,terminalTrib){
   // set up paths
 var index = 0;

  for( var i = 0; i < xy.length; i++ ){       // starting river
    for( var j = 0; j < xy.length; j++ ){     // ending river

      var path = [xy[i].riverN]; //Starting river and default for i=j - staying in river.
      var coords = [];
      
      // staying in the same river
      if (i == j) { 
        coords = xy[i].coordinates; 
      }
      
      // going downstream 
      else if(i < j){
        for( var ii = 1; ii < xy.length; ii++ ){
          if ( nextDown[path[[ii - 1]]] >= j ) {
            path[ii] = j;
            break;
          }
          else {
            path[ii] = nextDown[path[[ii - 1]]];
          }  
          
        }
        
        var riverHold = [];          
        
        for( var d = 0; d < path.length; d++ ){               
                       
           //if terminal trib to start, reverse dir of coordinates
           // or if mainstem, reverse dir of coordinates
           if ( (terminalTrib[path[d]] == 1 && d == 0) ||
                (terminalTrib[path[d]] == 0)){
             riverHold = xy[path[d]].coordinates.slice().reverse();
           }
           // do not reverse if terminalTrib is last step (i.e not the first) 
           else if (terminalTrib[path[d]] == 1 && d > 0) { riverHold = xy[path[d]].coordinates }

           coords = coords.concat(riverHold);
           
        }
      }

      //going upstream - symmetrical with downstream. Just reverse direction for paths and coords
      else if(i > j) { 
        path = paths.filter( function(d) { return d.startRiver == j && d.endRiver == i;})[0].path
                    .slice()
                    .reverse();
        
        coords = paths.filter( function(d) { return d.startRiver == j && d.endRiver == i;})[0].coordinates
                    .slice()
                    .reverse();            
      }
      
      paths[index] = { startRiver:i,
                       endRiver: j,
                       path: path,
                       coordinates: coords
                     };
      
      index = index + 1;
      //console.log(i,j,path,coords) 
    
   }  
  }
  
//  console.log("paths",paths);
  return paths;
}

// get path between the current and next time step
function getPath (nodesCurrentTmp) {
    nodesCurrentTmp.forEach(function (d,i) {
      
        var timeStepIndex = d.sample.indexOf(state.currentSample); // for all arrays in d
        
        d.nodePossiblePath = paths.filter( function(dd){ return dd.startRiver == d.riverN[timeStepIndex] & dd.endRiver == d.riverN[timeStepIndex + 1] } );

//console.log("inside",i,timeStepIndex)

        d.pathStart = xy.filter( function(dd){ return dd.riverN == d.riverN[timeStepIndex    ] })[0].coordinates[d.sectionN[timeStepIndex    ] - 1];// -1 because of 0 indexing of sectionN
        d.pathEnd =   xy.filter( function(dd){ return dd.riverN == d.riverN[timeStepIndex + 1] })[0].coordinates[d.sectionN[timeStepIndex + 1] - 1];
        d.pathStartIndex = d.nodePossiblePath[0].coordinates.indexOf(d.pathStart);
        d.pathEndIndex =   d.nodePossiblePath[0].coordinates.indexOf(d.pathEnd);
        
        if(d.pathStartIndex <= d.pathEndIndex){
          d.nodePath =  d.nodePossiblePath[0].coordinates.slice(d.pathStartIndex,d.pathEndIndex + 1);
        }
        else d.nodePath = d.nodePossiblePath[0].coordinates.slice(d.pathEndIndex,d.pathStartIndex + 1).reverse(); //if stay in same river and go downstream

        d.once = false;
 //     }
    });
    return nodesCurrentTmp;
}

// for fish only caught once
// same structure as getPath, except the 'path' is just the current location
function getPathFirstOnly (nodesFirstSampleOnly) {
    nodesFirstSampleOnly.forEach(function (d,i) {
      
        var timeStepIndex = d.sample.indexOf(state.currentSample); // for all arrays in d
        
        d.nodePossiblePath = paths.filter( function(dd){ return dd.startRiver == d.riverN[timeStepIndex] & dd.endRiver == d.riverN[timeStepIndex + 0] } );

//console.log("inside",i,timeStepIndex)

        d.pathStart = xy.filter( function(dd){ return dd.riverN == d.riverN[timeStepIndex    ] })[0].coordinates[d.sectionN[timeStepIndex    ] - 1];// -1 because of 0 indexing of sectionN
        d.pathEnd =   xy.filter( function(dd){ return dd.riverN == d.riverN[timeStepIndex + 0] })[0].coordinates[d.sectionN[timeStepIndex + 0] - 1];
        d.pathStartIndex = d.nodePossiblePath[0].coordinates.indexOf(d.pathStart);
        d.pathEndIndex =   d.nodePossiblePath[0].coordinates.indexOf(d.pathEnd);
        
        d.nodePath =  d.nodePossiblePath[0].coordinates.slice(d.pathStartIndex,d.pathEndIndex + 1);
        
        d.once = true;
    });
    return nodesFirstSampleOnly;
}



    
   
  function mouseMoved() {
    var a = this.parentNode, m = d3.mouse(this), d = simulation.find(m[0]- margin.left , m[1]- margin.top , searchRadius);
  //  console.log("mouseMoved",d)
    if (!d) return a.removeAttribute("title"), tooltip.style('visibility','hidden');
    a.setAttribute("title",d.id + " " + d.familyID + " " + d.section); 	

    tooltip
      .style("visibility", "visible");
  }


 /*        function initializeChart(){
           
            // Define tool tips //
          tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "Fish " + d.id + ", Family " + d.familyID //+ " [" + d.familyCount + "]"
              ;
            });
           
           canvas.call(tip);  
         }  
*/

         function updateSlider() {
           console.log('updateSlider', state);
           
           if ($("#slider").children().length > 1) {
             console.log("destroying slider");
             $("#sampleSlider").slider('destroy');
           }

           console.log('children', $('#sampleSlider').children().length);

           var sampSetLegend = state.sampSet.slice(state.sampSet); //create a clone
           
           if( state.sampSet.length-1 > sliderLabelsMaxNum ){
             var sliderInterval = Math.round( (state.sampSet.length-1)/sliderLabelsMaxNum );
             for(i = 0;  i < state.sampSet.length-1; i++){
               if( i % sliderInterval !== 0 ) sampSetLegend[i] = null;
             }   
           }

           state.currentSample = d3.min(state.sampSet);
           
           var slider = $('#sampleSlider').slider({   
            ticks: state.sampSet,
            ticks_labels: sampSetLegend,
            ticks_snap_bounds: 1,
            value: state.currentSample
          });
          
          $('#sampleSlider').on("slideStop", function () {
            state.currentSample = $('#sampleSlider').slider("getValue");
          
            updateRenderData();
            incrementSegments();
          });
          
         }