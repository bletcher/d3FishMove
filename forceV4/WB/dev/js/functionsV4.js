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
      d.dateEmigrated = Date.parse(d.dateEmigrated);
      return d;
    }

  function color(d){ return d.id; }
  
           function initializeState() {
             console.log('initializeState()');
   /*          state.selectedRiver = $("#selectedRiverDD").val();
       */    state.selectedSpecies = $("#selectedSpeciesDD").val();
             state.dotOption = $("#dotOptionDD").val();   
       //      state.barOption = $("#barOptionDD").val();
          //   state.barVariable = $("#barVariableDD").val();
             state.onClick = $("#onClickDD").val();
             state.propMovedDD = $("#propMovedDD").val();
             state.addLastSample = $("#addLastSampleDD").val();
     //        state.lines = $("#linesDD").val();
             console.log('state: ', state);
           }
           
           function initializeInterface() {
             console.log('initializeInterface()');
             
             $("#selectedSpeciesDD").on("change", function () {
              console.log("#selectedspeciesDD change");
              state.selectedSpecies = $("#selectedSpeciesDD").val();
              updateRenderData();
              ticked();
              ended();
             });
   /*          $("#selectedRiverDD").on("change", function () {
              console.log("#selectedRiverDD change");
              state.selectedRiver = $("#selectedRiverDD").val();
              updateRiverSpecies(state);
              ticked();
             });
      */       $("#unselectAll").on("click", function () {
               console.log("#unselectAll click");
              // resetColorsToSpp();
               resetOpacityToOne();
               state.selectedID = [];
               updateRenderData();
               ticked();
               ended();
             });
             $("#resetSppColors").on("click", function () {
               console.log("#resetSppColors click");
            //   resetColorsToSppUnSelected();
               resetOpacityToOne();
          //     state.selectedID = [];
               updateRenderData();
               ticked();
               ended();
             });
             $("#dotOptionDD").on("change", function () {
               console.log("#dotOption change");
               state.dotOption = $("#dotOptionDD").val();
               updateRenderData();
               ticked();
               ended();
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
         //      resetColorsToSpp();
               resetOpacityToOne();
               state.selectedID = [];
               updateRenderData();
               ticked();
               ended();
             });
            $("#propMovedDD").on("change", function () {
               console.log("#propMovedDD change");
               state.propMovedDD = $("#propMovedDD").val();
               ended();
            });   
            $("#addLastSampleDD").on("change", function () {
               console.log("#addLastSampleDD change");
               state.addLastSample = $("#addLastSampleDD").val();
               ended();
             });
           }
  
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
      state.currentSample = minTimeStep + 1;
      maxTimeStep = d3.max(cd, function(d) { return d.sample; });
      console.log("timeStep",state.currentSample,maxTimeStep,cd);
      
      // get set of unique samples with year and season - must be a better way...
      cd.forEach(function(d,i){
        d.uniqueString = d.sample.toString().concat("_" + d.year.toString()).concat("_" + d.season.toString());
      });
      
      var uString = sortUnique(cd.map( function(d) { return d.uniqueString } ));
      
      state.sampleInfo = uString.map(function(d){
        return {
          sample: +d.split("_")[0],
          year: +d.split("_")[1],
          season: d.split("_")[2]
        };
      });
  
      // put into separate arrays so they are easy to read for repeated calls
      state.sampSet = state.sampleInfo.map(function(d){return d.sample});
      state.yearSet = state.sampleInfo.map(function(d){return d.year});
      state.seasonSet = state.sampleInfo.map(function(d){return d.season});
      
      // Define starting sample #
      state.currentSample = d3.min(state.sampSet);
          
    //  console.log("sampSet",state);
  
      spp = uniques( cd.map( function(d) {return d.species}) ); // array of unique species
      console.log("spp",spp);
      
      assignSectionN(cd,xyIn);
      
      // add extra row for fish that emigrated. Put them in section 0 in the WB [river 7]
      addEmigrants(cd);
  
      byFish = d3.nest()
                 .key(function(d){return d.id;}).sortKeys(d3.ascending)
                 .entries(cd);
      
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
                     date: d.values.map(function(dd) {
                       return dd.date;
                     }),
                     species: d.values[0].species,
                     speciesIndex: spp.indexOf(d.values[0].species), // integer value of spp
                     color: sppScaleColor( d.values[0].species ),// colorScale( spp.indexOf(d.values[0].species) ),
                     familyID: d.values[0].familyID,
                     dateEmigrated: d.values[0].dateEmigrated
               //      uniqueString: d.values[0].uniqueString
                   };
                 });
    
    state.nodes.forEach( function(d){ d.firstSample = d3.min(d.sample);//d.sample[0];
                                      d.lastSample  = d3.max(d.sample);
                                    }
                       );
                                    
  }
  
  function ticked() {
  //  console.log(state.currentSample,simulation.alpha())
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(margin.left, margin.top); // subtract the margin values whenever use simulation.find()
  
    context.beginPath();
    xy.forEach(drawcoordinate);
    context.fillStyle = 'rgb(245, 245, 245)';//"lightgrey";
    context.fill();
    context.strokeStyle = 'rgb(245, 245, 245)';//"lightgrey";
    context.stroke();
  
    spp.forEach(drawLegend);
  
    state.nodesRender.forEach(drawNode);
  
    context.restore();
  }
  
  
  function drawcoordinate (d, i) {
    d.coordinates.forEach( function (dd,ii) {
      context.moveTo(xScale(dd[0]), yScale(dd[1]));
      context.arc(   xScale(dd[0]), yScale(dd[1]), 10, 0, 2 * Math.PI);
    });
  }
  
  
  function drawLegend(d,i){
    // move to global variables?
    var vOffset = 20, radius = 7; vOffsetText = radius/2;
    var w = width - 100, h = height - vOffset * i - 20;
    var col = d3.rgb(sppScaleColor( d ));
    
    col.opacity = 1;
    
    context.beginPath();
    context.moveTo(w, h );
    context.arc(   w, h, radius, 0, 2 * Math.PI);
    context.strokeStyle = col.darker(2);
    context.stroke();
    context.fillStyle = col;
    context.fill();
    context.font = "15px Arial";
    context.fillText(sppScale(d) ,w + 20, h + vOffsetText);
  //  console.log(d,sppScaleColor( d ))
  }
  
  function drawNode (d, i) {
  
    context.beginPath();
    context.moveTo(d.x, d.y );
  
    if( ((d.isFirstSample) && (simulation.alpha() < 0.2)) ){  // keep new fish from entering from the upper left, they emerge near the end
        
      context.arc(   d.x, d.y, ageScale(d.currentAge)*(1-simulation.alpha()/0.2), 0, 2 * Math.PI);
  
      d.color.opacity = 1;
      state.selectedID.length > 0;
      if(state.selectedID.length > 0 && !IDinSelectedID(state.selectedID,d.id)) {  
        d.color.opacity = 0.1;
      }

      context.strokeStyle = d.color;
      context.stroke();
      context.fillStyle = d.color;
      context.fill();
    }  
    
    else if (!d.isFirstSample ) {
      
      context.arc(d.x, d.y, ageScale(d.currentAge), 0, 2 * Math.PI);
  
      d.color.opacity = 1;
      state.selectedID.length > 0;
      if(state.selectedID.length > 0 && !IDinSelectedID(state.selectedID,d.id)) {  
        d.color.opacity = 0.1;
      }

      context.strokeStyle = d.color;
      context.stroke();
      context.fillStyle = d.color;
      context.fill();
   }
 } 
  
  function ended(){
  
    if( state.addLastSample == "yes" ){
      context.save();
    //  context.clearRect(0, 0, canvas.width, canvas.height);
      context.translate(margin.left, margin.top); // subtract the margin values whenever use simulation.find()
    
      state.nodesRender.forEach(fillInLastSample);
      
      context.restore();
    }
    else if( state.addLastSample == "no" ){
      ticked();
    }
    
    drawHeatMap();
    
  }
  
  function addEmigrants(cd){
    cd.forEach(function(d,i){
      
      if ( !isNaN( d.dateEmigrated ) && d.sample == d.maxSample ){
  
        var e = jQuery.extend(true, {}, d); //clone
  
        e.date = d.dateEmigrated;
        e.lagSection = d.section;
        e.maxSample = d.sample + 1; 
        e.river = emigrationRiver; e.riverAbbr = emigrationRiver;
        e.riverN = emigrationRiverN;
        e.sample = d.sample + 1;
        e.season = getNextSeason(d.season); e.seasonStr = e.season;
        e.section = emigrationSection; e.sectionN = emigrationSectionN;
        if (d.season == "Winter") { e.year = d.year + 1; e.age = d.age + 1; }
        
        d.maxSample = d.sample + 1;
  
        cd.push(e);
      }
    });
  }
  
  function fillInLastSample(d){
      if ( d.isLastSample ){
  
        context.beginPath();
        context.moveTo(d.x, d.y );
        context.arc(d.x, d.y, ageScale(d.currentAge) - 1, 0, 2 * Math.PI);
        context.fillStyle = d3.rgb(253,255,204); // ICE
    //    context.fillStyle = "#E4FB68"//"#EFEE69"//"#ffffb3";//'rgb(250,250,250)';//"yellow";
        context.fill();
    }
  }
  
  function getNodesCurrent(){
    
    // get fish that were seen only once at the end of the interval (state.currentSample + 1, beginning of this one)  
    nodesFirstSampleOnly = state.nodes.filter( function(d) { return d.sample.includes( state.currentSample + 1 ) && d.sample.length == 1 });
    getPathFirstOnly(nodesFirstSampleOnly);
    nodesFirstSampleOnly.forEach( function(d) { d.isFirstSample = ( d.firstSample == state.currentSample + 1 );
                                                d.isLastSample  = ( d.lastSample  == state.currentSample + 1 );
                                              }
                                );
    
    // get fish that were seen in the beginning and end of the interval [this to next]
    nodesCurrentTmp = state.nodes.filter( function(d) { return d.sample.includes( state.currentSample ) && d.sample.includes( state.currentSample + 1 ) });
    getPath(nodesCurrentTmp);
    nodesCurrentTmp.forEach( function(d) { d.isFirstSample = ( d.firstSample == state.currentSample );
                                           d.isLastSample  = ( d.lastSample  == state.currentSample + 1 );
                                         }
                           );
    
    // Put them together
    state.nodesCurrent = nodesCurrentTmp.concat(nodesFirstSampleOnly);
    
    // Update 3 variables
    state.nodesCurrent.forEach( function(d) { d.coordinate = d.pathEnd; } );
  
  }
  
  function updateRenderData(){
    
    getNodesCurrent();
    state.nodesCurrent.forEach(function(d) { updateCurrentAge(d); });
    getNodesRender();
    
    state.nodesCurrent.forEach(function(d) { updateCurrentSeason(d); updateCurrentYear(d); });
    
    state.currentSeason = getDataSampleInfo(state.sampleInfo,state.currentSample)[0].season;
    $("#seasonLabel").html(state.currentSeason + " - " + getNextSeason( state.currentSeason ));
    
    state.currentYear = getDataSampleInfo(state.sampleInfo,state.currentSample)[0].year;
    $("#yearLabel").html(state.currentYear);
    
  }
  
  function getNodesRender(){
    
    if( state.selectedSpecies != "all") { state.nodesCurrent = getDataSpecies(state.nodesCurrent, state.selectedSpecies);}
    
    if (      state.dotOption == "all" ) {      state.nodesRender = state.nodesCurrent; }
    else if ( state.dotOption == "selected" ) { state.nodesRender = getSelected(state.nodesCurrent); }
  }


  function incrementSegments(){
  /*
    // Jump to path end if first sample or skip a sample
    if( (state.currentSample == minTimeStep + 1) || (state.currentSample != state.previousSample + 1) ){  
      
      state.nodesRender.forEach(function (d,i) { d.coordinate = d.pathEnd; });
      console.log("Prop done moving all",state.nodesRender);
      simulation.alpha(1).alphaMin(0.01).nodes(state.nodesRender).restart();
    }
    
    // Step through path
    else {  
  */  
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
      //     $("#simAlphaLabel").html(simulation.alpha().toFixed(2));
           
           var aMin = state.currentSample == minTimeStep+1 ? 0.00001 : 0.01;
           simulation.alpha(1).alphaMin(0.01).nodes(state.nodesRender).restart(); //alphaMin > 0 shortens the simulation - keeps the dots from jiggling near end as they find the packing solution
    
           if (state.nodesRender.length === 0 || indexNumDone/state.nodesRender.length == 1) clearInterval(intervalNum);
           
       },intDur);
   // }
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
  
  function selectedIDIsNotAlive(){
    state.selectedID.forEach( function(d){
      console.log("selectedIsAlive",d);
      if( !state.nodesRender.map(function(d){ return d.id }).includes(d) ){ console.log("selectedIsNOTAlive",d);state.selectedID.splice(state.selectedID.indexOf(d),1)  }
    });
  }

  function resetOpacityToOne(){
    state.nodes.forEach( function(d){ d.color.opacity = 1;} );  
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

       // selecting new point
       if ( !IDinSelectedID( state.selectedID,d.id ) ){
         state.selectedID.push(d.id);
         console.log("selected",state.selectedID);
       }
       
       // unselect existing selected ID
       else if ( IDinSelectedID(state.selectedID,d.id) ){
         unSelectThisOne(d);
         console.log("UNselected",state.selectedID);
       }
     }
     
     else if (state.onClick == "sec") {

       // Empty selectedID array
       state.selectedID = [];
       
       // get all data from the section of the selected individual
       state.sectionData = getDataSection(state.nodesRender,d.coordinate);

       // Add ID's of the selected fish's family to selectedID
       state.selectedID = state.sectionData.map( function(d){ return(d.id) } );

     }
     // Select IDs of all individuals in the selected individual's family
     else if (state.onClick == "fam") {

       // Empty selectedID array
       state.selectedID = [];
       
       // get all data from the family of the selected individual
       state.familyData = getDataFamily(state.nodesRender,d.familyID);
       // Add ID's of the selected fish's family to selectedID
       state.selectedID = state.familyData.map( function(d){ return(d.id) } );

       console.log("family",state.selectedID);
     }
     
     updateRenderData();
     ticked();
     ended(); 
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
  
  function getDataSpecies(d,s) {
    return d.filter( function(d) {
      return d.species == s;
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

  function getDataSampleInfo(dd,s) {
    return dd.filter( function(d) {
      return d.sample == s;
    });
  }

  function getFirstSample(dd,s) {
    return dd.filter( function(d) {
      return d.isFirstSample;
    });
  }
  function getLastSample(dd,s) {
    return dd.filter( function(d) {
      return d.isLastSample;
    });
  }

  function getDataEmigrated(dd) {
    return dd.filter( function(d) {
      return !isNaN(d.dateEmigrated);
    });
  }

  function getNextSeason(s){
    var n;
    switch(s){
      case "Spring":
        n = "Summer";
        break;
      case "Summer":
        n = "Autumn";
        break;
      case "Autumn":
        n = "Winter";
        break;
      case "Winter":
        n = "Spring";
        break;
    }
    return n;
  }

  function getStartRiver(dd,s) {
    return dd.filter( function(d) {
      return d.key == s;
    });
  }

  function getEndRiver(dd,s) {
    return dd.filter( function(d) {
      return d.values.key == s;
    });
  }
  
  function getStartAndEndRiver(ddd,s,e) {
    return ddd.filter( function(dd) {
      return dd.key == s; {
        return dd.filter(function(d){
          d.key.values == e;
        });  
      }
    });
  }
/*
var priority_order = ['MUST', "SHOULD", 'COULD', 'WISH'];
var nested_data = d3.nest()
.key(function(d) { return d.status; }).sortKeys(d3.ascending)
.key(function(d) { return d.priority; }).sortKeys(function(a,b) { return priority_order.indexOf(a) - priority_order.indexOf(b); })
.rollup(function(leaves) { return leaves.length; })
.entries(csv_data);
*/

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
  console.log("assign",cd,xyIn)
    cd.forEach(function (d,i) {
      d.sectionN = xyIn.filter( function(dd) { return d.riverAbbr == dd.riverAbbr && d.section == dd.section } )[0].sectionN;
      d.riverN =   xyIn.filter( function(dd) { return d.riverAbbr == dd.riverAbbr && d.section == dd.section } )[0].riverN;
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
          path = paths.filter( function(d) { return d.startRiverN == j && d.endRiverN == i;})[0].path
                      .slice()
                      .reverse();
          
          coords = paths.filter( function(d) { return d.startRiverN == j && d.endRiverN == i;})[0].coordinates
                      .slice()
                      .reverse();            
        }
        
        paths[index] = { startRiverN:i,
                         endRiverN: j,
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
          
          d.nodePossiblePath = paths.filter( function(dd){ return dd.startRiverN == d.riverN[timeStepIndex] & dd.endRiverN == d.riverN[timeStepIndex + 1] } );
  
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
  
  // for fish only caught once, on the second sample of the interval
  // same structure as getPath, except the 'path' is just the current location
  function getPathFirstOnly (nodesFirstSampleOnly) {
      nodesFirstSampleOnly.forEach(function (d,i) {
        
          var timeStepIndex = d.sample.indexOf(state.currentSample); // for all arrays in d
          
          d.nodePossiblePath = paths.filter( function(dd){ return dd.startRiverN == d.riverN[timeStepIndex + 1] & dd.endRiverN == d.riverN[timeStepIndex + 1] } );
  
  //console.log("inside",i,timeStepIndex)
  
          d.pathStart = xy.filter( function(dd){ return dd.riverN == d.riverN[timeStepIndex + 1] })[0].coordinates[d.sectionN[timeStepIndex + 1] - 1];// -1 because of 0 indexing of sectionN
          d.pathEnd =   xy.filter( function(dd){ return dd.riverN == d.riverN[timeStepIndex + 1] })[0].coordinates[d.sectionN[timeStepIndex + 1] - 1];
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
    a.setAttribute("title",d.id + " " + d.familyID + " Sections " + d.section +
                           " Samples " + d.sample); 	

    tooltip
      .style("visibility", "visible");
  }

  function updateSlider() {
   console.log('updateSlider', state);
   
   if ($("#slider").children().length > 1) {
     console.log("destroying slider");
     $("#sampleSlider").slider('destroy');
   }
  
   console.log('children', $('#sampleSlider').children().length);
   
   var sampSetLegend = state.yearSet.slice(state.yearSet.samps); //create a clone
   
   if( state.sampSet.length - 1 > sliderLabelsMaxNum ){
     var sliderInterval = Math.round( (state.sampSet.length - 1)/sliderLabelsMaxNum );
     for(i = 0;  i < state.sampSet.length-1; i++){
       if( i % sliderInterval !== 0 ) sampSetLegend[i] = null;
     }   
   }
  
   var slider = $('#sampleSlider').slider({   
    ticks: state.sampSet,
    ticks_labels: sampSetLegend,
    ticks_snap_bounds: 1,
    value: state.currentSample
  });
  
  $('#sampleSlider').on("slideStop", function () {
    state.previousSample = state.currentSample;
    state.currentSample = $('#sampleSlider').slider("getValue");
    console.log("samples",state.previousSample,state.currentSample)
  
    updateRenderData();
    incrementSegments();
  });
  
  }
  
  function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
  }
  
  function fill2D(rows, cols,i) {
    var array = [], row = [];
    while (cols--) row.push(i);
    while (rows--) array.push(row.slice());
    return array;
  }