// inputting data
    function type(d){
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
      return d;
    }

 // Accessor functions for circle attributes
      function x(d) { return d.len }
      function y(d) { return d.section }
      function y2(d) { return d.distMoved }
      function r(d) { return d.river }
      
      function color(d){ return d.id; }
      function colorFamilyID(d){ return d.familyID; }
      function keyID(d){ return d.id; }
      function keyIDPath(d) {return d.map(function(d){ return(d.id)}) }

      
//Processing functions
//
         function initializeChart(){
           svg1 = d3.select("#chart1")
             .append("svg")
             .attr("width",  w)  
             .attr("height", h)
           ;
            
           svg2 = d3.select("#chart2")
             .append("svg")
             .attr("width",  w)
             .attr("height", h)
           ;  
           
            // Define tool tips //
          tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "Fish " + d.id + ", Family " + d.familyID;
            });
              
          tipBar = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return Math.round(d);// + " g" ;
            })
            ;
            
           svg1.call(tip),svg2.call(tip);
           svg1.call(tipBar),svg2.call(tipBar);  
         }  
          
         function initializeState() {
           console.log('initializeState()');
           state.selectedRiver = $("#selectedRiverDD").val();
           state.selectedSpecies = $("#selectedSpeciesDD").val();
           state.dotOption = $("#dotOptionDD").val();   //use for state of dropdowns
           state.barOption = $("#barOptionDD").val();
           state.barVariable = $("#barVariableDD").val();
           console.log('state: ', state);
         }
         
         function initializeInterface() {
           console.log('initializeInterface()');
           
           $("#selectedSpeciesDD").on("change", function () {
            console.log("#selectedspeciesDD change");
            state.selectedSpecies = $("#selectedSpeciesDD").val();
            updateRiverSpecies(state);
            render(state,2);
           });
           $("#selectedRiverDD").on("change", function () {
            console.log("#selectedRiverDD change");
            state.selectedRiver = $("#selectedRiverDD").val();
            updateRiverSpecies(state);
            render(state,2);
           });
           $("#unselectAll").on("click", function () {
             console.log("#unselectAll click");
             state.selectedID = [];
             render(state,0.2);
           });
           $("#dotOptionDD").on("change", function () {
             console.log("#dotOption change");
             state.dotOption = $("#dotOptionDD").val();
             render(state,2);
           });

           $("#barOptionDD").on("change", function () {
             console.log("#barOption change");
             state.barOption = $("#barOptionDD").val();
             render(state,2);
           });
           $("#barVariableDD").on("change", function () {
             console.log("#barVariableDD change");
             state.barVariable = $("#barVariableDD").val();
             render(state,2);
           });
         }

         function updateRiverSpecies(state) {
           console.log('updateRiverSpecies');
           state.riverData = getDataRiver(state.allData, state.selectedRiver);
           state.speciesData = getDataSpecies(state.allData, state.selectedSpecies);
           state.riverSpeciesData = getDataRiverSpecies(state.allData, state.selectedRiver, state.selectedSpecies);
           console.log('updateRiverSpecies', state);
           
           updateScales(state);
           updateSlider(state);
           updateRenderData(state);  
         }
         

         function updateSlider(state) {
           console.log('updateSlider', state);
           
           if ($("#slider").children().length > 1) {
             console.log("destroying slider");
             $("#sampleSlider").slider('destroy');
           }

           console.log('children', $('#sampleSlider').children().length);

           state.sampSet = sortUnique(state.riverSpeciesData.map(function(d) { return d.sample; }));
           console.log(state.sampSet);
           
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
            render(state,4);
          });
          
         }

         function updateScales(state){
           console.log('updateScales', state);
           state.maxLength = d3.max(state.riverSpeciesData, function(d) { return d.len; });
           state.maxSection = d3.max(state.riverSpeciesData, function(d) { return d.section; });
           
           xScale = d3.scale.linear().domain([50, state.maxLength]).range([xPadding, w-xPadding]);
           yScale = d3.scale.linear().domain([0.5, state.maxSection]).range([h-yPadding, yPadding]);
           
           xScale2 = d3.scale.linear().domain([50, state.maxLength]).range([xPadding , w - xPadding ]);
           yScale2 = d3.scale.linear().domain([-state.maxSection, state.maxSection]).range([h - yPadding, yPadding]);
           
           yScale2Bar = d3.scale.linear().domain([-0.75, state.maxSection * 2]).range([h - yPadding, yPadding]); // not sure why 0.75 works
           radiusScale = d3.scale.linear().domain([50, state.maxLength]).range([2, 8]);
           colorScale = colorScale;
         }

//Axis functions
//
         function initializeAxes(state){
           console.log('initialize axes', state);
           updateScales(state);
           midLength = (d3.max(state.riverSpeciesData, function(d) { return d.len; }) - d3.min(state.riverSpeciesData, function(d) { return d.len; }))/2 + 50;
           // Define axes for Absolute plot
           xAxis1 = d3.svg.axis().orient("bottom").scale(xScale).ticks(6);
          
           svg1.append("g")
                .attr("class", "xAxis")
                .attr("transform","translate(0," + (h- yPadding) +")")
                .call(xAxis1);
            
           yAxis1 = d3.svg.axis().scale(yScale).orient("left").ticks(state.maxSection, d3.format(",d"));
           svg1.append("g")
                .attr("class", "yAxis")
                .attr("transform","translate(" + xPadding  + ",0)")
                .call(yAxis1);
         
         // Add x-axis1 label 
           svg1.append("text").transition()
                .attr("class", "x label")
                .attr("text-anchor", "middle")
                .attr("x", xScale(midLength))
                .attr("y", h - 6)
                .text("Fish length (mm)");
                
         // Add y-axis1 label 
           svg1.append("text")
                .attr("class", "y label")
                .attr('transform', 'translate(' + 10 + ',' + h / 1.5 + ') rotate(-90)')
                .text("Section number (20 m)");
                
         // ---------------------------------------------        
         // Define axes for Relative plot
            var xAxis2 = d3.svg.axis().orient("bottom").scale(xScale2).ticks(6);//, d3.format(",d"));
            svg2.append("g")
                .attr("class", "xAxis")
                .attr("transform","translate(0," + (h- yPadding) +")")
                .call(xAxis2);
                
            var yAxis2 = d3.svg.axis().scale(yScale2).orient("left").ticks(maxSection, d3.format(",d"));
            svg2.append("g")
                .attr("class", "yAxis")
                .attr("transform","translate(" + (xPadding )  + ",0)")
            //    .attr("transform","translate(40,0)")
                .call(yAxis2); 
                
         // Add x-axis2 label 
            svg2.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "middle")
                .attr("x", xScale2(midLength))
                .attr("y", h - 6)
                .text("Fish length (mm)");
                
         // Add y-axis2 label 
            svg2.append("text")
                .attr("class", "y label")
                .attr('transform', 'translate(' + ( xPadding - 30) + ',' + h / 1.6 + ') rotate(-90)')
                .text("Distance to move (20 m sections)");
          
                
                
         }

         function updateRenderData(state){
           console.log('updateRenderData',state);
           
           state.currentSampleDataAll = getSampleData( state.riverSpeciesData, state.currentSample );
           state.previousSampleDataAll = getSampleData( state.riverSpeciesData, state.currentSample-1 );
           
           state.currentSampleDataSelected = getSampleDataSelected( state.riverSpeciesData, state.currentSample );
           state.previousSampleDataSelected = getSampleDataSelected( state.riverSpeciesData, state.currentSample-1 );
           state.allSamplesSelected = getSelected( state.riverSpeciesData );
           
           if( state.dotOption == "all" ) { state.renderData = state.currentSampleDataAll; }
           else if ( state.dotOption == "selected" ) { state.renderData = state.currentSampleDataSelected; }
           console.log("render2",state);
           state.renderData2 = getNoUndefDistMoved( state.renderData ); //remove fish with undefined movedist for relative plots. 
           console.log("render2",state);
         }     
         
         function updateAxes(state,seconds){
             console.log('updateAxes',state);           
         
             xAxis1 = d3.svg.axis().orient("bottom").scale(xScale).ticks(6);
             svg1.select(".xAxis").transition().duration(1000*seconds).call(xAxis1);
             
             yAxis1 = d3.svg.axis().scale(yScale).orient("left").ticks(state.maxSection, d3.format(",d"));
             svg1.select(".yAxis").transition().duration(1000*seconds).call(yAxis1);
             
             xAxis2 = d3.svg.axis().orient("bottom").scale(xScale2).ticks(6);
             svg2.select(".xAxis").transition().duration(1000*seconds).call(xAxis2);
             
             yAxis2 = d3.svg.axis().scale(yScale2).orient("left").ticks(maxSection, d3.format(",d"));
             svg2.select(".yAxis").transition().duration(1000*seconds).call(yAxis2);
         
         }


// General functions
//    
    // Sort numbers ascending
    function compareNumbers(a, b) {
     return a - b;
    }
    
// Data processing
//

    function sortUnique(arr) {
        arr.sort();
        var last_i;
        for (var i=0;i<arr.length;i++)
            if ((last_i = arr.lastIndexOf(arr[i])) !== i)
                arr.splice(i+1, last_i-i);
        return arr;
    }

// Subsetting data
//
    function getSampleData(d,s) {
      return d.filter( function(d) {
        return d.sample == s;
      });
    } 
    
    function getSampleDataSelected(d,s) {
      return d.filter( function(d) {
        return d.sample == s & IDinSelectedID(state.selectedID,d.id);
      });
    }
     
    function getSelected(dd) {
      return dd.filter( function(d) {
        return IDinSelectedID(state.selectedID,d.id);
      });
    }

    function getDataID(d,id) {
      return d.filter( function(d) {
        return d.id == id;
      });
    }

    function getDataRiver(d,r) {
      return d.filter( function(d) {
        return d.river == r;
      });
    }

    function getDataSpecies(d,s) {
      return d.filter( function(d) {
        return d.species == s;
      });
    }

    function getDataRiverSpecies(d,r,s) {
      return d.filter( function(d) {
        return d.river == r & d.species == s;
      });
    }
    
    function getDataSection(inDat, d,i){
      console.log("in get data",d,i);
      return inDat.filter( function(inDat) {
        return inDat.section == i + 1;
      });
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
   
    function getNoUndefDistMoved(d){
      return d.filter( function(d) {
        return isNaN( d.distMoved ) === false;
      });
    } 
    
    function getDataFamily(d,famID){
      return d.filter( function(d) {
        return d.familyID == famID;
      });
    }
    
    function emptyObjForPath(){
       // empty the object so we can push to it without dups
       arrForPath = {
         id: [],
         samples: []   
       };
    //   arrForPath.samples.xx = [];
    //   arrForPath.samples.yy = [];
       //return arrForPath;
     }   
///////////////////////////////////////////// 
// functions for showing and selecting dots  
/////////////////////////////////////////////

    // Absolute positions for the dots based on data
    function position(dot) {
      dot
        .attr("cx", function (d){ return xScale(x(d)); })
        .attr("cy", function (d  ){ return yScale(y(d)); })
        .attr("r", function(d) { return radiusScale(x(d)); });
    }

    // Relative positions for the dots based on data
    function position2(dot) {
      dot
        .attr("cx", function (d){ return xScale2(x(d)); })
        .attr("cy", function (d  ){ return yScale2(y2(d)); })
        .attr("r", function(d) { return radiusScale(x(d)); });
    } 
 
 
     function mouseOverDot(d){
       console.log("mouseOverDot");
       tip.show(d);
       d3.select(this)
         .style("fill", "orange")
       
       ;
     }

     function mouseOutDot(){
       tip.hide;
       d3.select(this)
         .style("fill", "lightgrey")
        // .style("z-index", 0)
       ;
     }
      
     function clickDot(d){
       console.log("mouseClickDot");
       
       // select an individual circle when clicked without cntl
       if (!d3.event.ctrlKey) {
       
         // selecting new point
         if ( !IDinSelectedID( state.selectedID,d.id ) ){
           state.selectedID.push(d.id);
           console.log(state.selectedID);
         
           this.parentElement.appendChild(this); // doesn't seem to work with a function
           d3.select(this).style("fill", function(d){ return colorScale( color(d) ); } );
                  
         }
         // unselect existing selected ID
         else if ( IDinSelectedID(state.selectedID,d.id) ){
           unSelectThisOne(d);
           console.log(state.selectedID);
           
           d3.select(this)
             .style("fill", "lightgrey")
           ;
         }
       }
       
       // Select IDs of all individuals in the selected individual's family
       else if (d3.event.ctrlKey) {
         console.log("mouseClickDot-family selection",d ,d.familyID);
         // Empty selectedID array
         state.selectedID = [];
         
         // get all data from the family of the selected individual
         state.familyData = getDataFamily(state.riverSpeciesData,d.familyID);
         // Add ID's of the selected fish's family to selectedID
         state.selectedID = state.familyData.map( function(d){ return(d.id) } );
         
       }
       
       render(state,0.1); //
     }
     
     function mouseOverColorBar(d,i){
       d3.select(this).style("fill", "darkgrey");
 //      console.log("mouseOverColorBar",d,i,this);
     }
     
     function mouseOutColorBar(d){
			 d3.select(this).style("fill", "lightgrey");
			      
 //      console.log("mouseOutColorBar",d,i,getBarColor(d),this);
     }
     
 //    function getBarColor(d){
 //      return "rgb(" + (barGreyBase - d * barGreyMult) + ", " + (barGreyBase - d * barGreyMult) + ", " + (barGreyBase - d * barGreyMult) + ")"
 //    }
     
     function clickBar(d,i){

       // If cntl-click add new section to selected
       if (d3.event.ctrlKey) {
         var newSel = getDataSection(state.renderData,d,i).map( function(d){ return(d.id) } );
         state.selectedID = state.selectedID.concat(newSel);
       }
       
       // If click, select this section only
       else {
         state.selectedID = getDataSection(state.renderData,d,i).map( function(d){ return(d.id) } );
       }
       
       console.log("mouseClickBar",d,i,state.selectedID);
       render(state,0.1);
     }
     
     function prepareDataForPath(){
       
     }
      
     moveToFrontIfSelected = function(d){
       if ( IDinSelectedID(state.selectedID,d.id) ){ moveToFront(d); }
     };
 
     function moveToFront(d) { 
       console.log("moveToFront");
       this.parentElement.appendChild(this); 
     }
 
     function colorWithSelected(d) { 
        if ( IDinSelectedID(state.selectedID,d.id) & d.enc == 1 ) {
           return colorScale( color(d) );  
        }                 
        else { 
           return "lightgrey"; 
        }
     }
     
     function strokeWithSelected(d) { 
        if ( IDinSelectedID(state.selectedID,d.id) ) {
           return colorScale( color(d) );  
        }                 
        else { 
           return "darkgrey"; 
        }
     }
     
     function colorWithFamilyID(d) { 
        if ( !isNaN(d.familyID) ) {
           return colorScale20( colorFamilyID(d) );  
        }                 
        else { 
           return "lightgrey"; 
        }
     }
     
// Bar data
//

// for svg1
    function getBarData1(state){  
      // Get counts and biomass by section into an array (sectArrxxx)
            summarizeBySection = d3.nest()
              .key(function(d) { return d.section; })
              .rollup(function(d) { 
                 return { 
                   sumWt: d3.sum(d, function(g) { return g.wt; }),
                   count: Object.keys(d).length //d.length
                 };
              })
              .map(state.renderData);
         //     console.log(summarizeBySection);
              var sectArrCount = [];
              var sectArrSumWt = [];
              
              for ( i = 1; i < state.maxSection + 1; i++){  
                if (state.barOption == "yes" & summarizeBySection[i] !== undefined){  //undefined if no entries for the section
                  sectArrCount.push(summarizeBySection[i].count);
                  sectArrSumWt.push(summarizeBySection[i].sumWt);
                } 
                // Don't plot bars if opt button is 'no'
                else if (state.barOption == "no" | summarizeBySection[i] === undefined){
                  sectArrCount.push(0);
                  sectArrSumWt.push(0);
                } 
              }
    
          if (state.barVariable == "count"){ 
            state.barData1 = sectArrCount;
            barGreyBase = barGreyBaseCount;
            barGreyMult = barGreyMultCount;
          }
          else if (state.barVariable == "biomass"){ 
            state.barData1 = sectArrSumWt;
            barGreyBase = barGreyBaseSumWt;
            barGreyMult = barGreyMultSumWt;
          }
          
          barScale1 = d3.scale.linear().domain([0, d3.max(state.barData1)]).range([0, maxBarRange]); //proportional
          //barScale1 = d3.scale.linear().domain([0, 50]).range([0, maxBarRange]); //absolute
    }  
 
//for svg2
    function getBarData2(state){  
      // Get counts and biomass by section into an array (sectArrxxx)
            summarizeBySection = d3.nest()
              .key(function(d) { return d.distMoved; })
              .rollup(function(d) { 
                 return { 
                   sumWt: d3.sum(d, function(g) { return g.wt; }),
                   count: Object.keys(d).length //d.length
                 };
              })
              .map(state.renderData2);
       //       console.log("getBarData2",summarizeBySection);
              var sectArrCount2 = [];
              var sectArrSumWt2 = [];
              
              for ( i = -state.maxSection; i < state.maxSection + 1; i++){  
                if (state.barOption == "yes" & summarizeBySection[i] !== undefined){  //undefined if no entries for the section
                  sectArrCount2[i + state.maxSection + 0] = summarizeBySection[i].count;
                  sectArrSumWt2[i + state.maxSection + 0] = summarizeBySection[i].sumWt;
                } 
                // Don't plot bars if opt button is 'no'
                else if (state.barOption == "no" | summarizeBySection[i] === undefined){
                  sectArrCount2[i + state.maxSection + 0] = 0;
                  sectArrSumWt2[i + state.maxSection + 0] = 0;
                } 
              }
    
          if (state.barVariable == "count"){ 
            state.barData2 = sectArrCount2;
            barGreyBase = barGreyBaseCount;
            barGreyMult = barGreyMultCount;
          }
          else if (state.barVariable == "biomass"){ 
            state.barData2 = sectArrSumWt2;
            barGreyBase = barGreyBaseSumWt;
            barGreyMult = barGreyMultSumWt;
          } 
          barScale2 = d3.scale.linear().domain([0, d3.max(state.barData2)]).range([0, maxBarRange]); //proportional
          //barScale2 = d3.scale.linear().domain([0, 100]).range([0, maxBarRange]); //absolute
    }
    
// for paths
//
