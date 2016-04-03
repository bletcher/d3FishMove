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
      return d;
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
    function getData(d,s) {
      return d.filter( function(d) {
        return d.sample == s;
      });
    } 
    
    function getDataAndPrevious(d,s) {
      return d.filter( function(d){
        return d.sample == s || d.sample == (s-1);
      });
    }
    
    function getDataAndSelected(dd,s) {
      return dd.filter( function(d) {
        return d.sample == s & IDinSelectedID(selectedID,d.id);
      });
    }

    function getDataRiver(d,s) {
      return d.filter( function(d) {
        return d.river == s;
      });
    }

// Slider bar
//
        
        // add a slider bar
        
        function addSlider(sampSet){
          var sampSetLegend = sampSet.slice(sampSet); // create a clone
          
          // don't plot all sample values on legend if there are more than sliderLabelsMaxNum
          if( sampSet.length-1 > sliderLabelsMaxNum ){
             var sliderInterval = Math.round( (sampSet.length-1)/sliderLabelsMaxNum );
             for(i = 0;  i < sampSet.length-1; i++){
               if( i % sliderInterval !== 0 ) sampSetLegend[i] = null;
             }   
          }

          console.log(sampSet);
          console.log(sampSetLegend);

          
          sampSlider = new Slider("#sampleSlider", {
            ticks: sampSet,
            ticks_labels: sampSetLegend,
            ticks_snap_bounds: 1,
            value: d3.min(sampSet)
          });
          return sampSlider;
        }
        



        
// Change river
//
         // assign selected river to selectedRiver and update inData
         $('#selectedRiverDD li a').on('click', function(){
            selectedRiver = $(this).text();
            console.log(selectedRiver);
            
            getDataNewRiver();
            
            
         });
         
         
         function getDataNewRiver(allData,currentSample,selectedRiver){
           
              inData = getDataAndPrevious(allData, currentSample);
              inData = getDataRiver(inData,selectedRiver);
              
              maxLength = d3.max(getDataRiver(allData,selectedRiver), function(d) { return d.len; });
              console.log(maxLength);  
              maxSection = d3.max(getDataRiver(allData,selectedRiver), function(d) { return d.section; });
              console.log(maxSection);
              
              seasonLabel.innerHTML = inData[inData.length-1].season;
              yearLabel.innerHTML = inData[inData.length-1].year;
           
           
           
         }
         
         function getDataNewSample(allData,currentSample,selectedRiver){
              inData = getDataAndPrevious(allData, currentSample);
              inData = getDataRiver(inData,selectedRiver);  //could do this first and only change when river is changed

              seasonLabel.innerHTML = inData[inData.length-1].season;
              yearLabel.innerHTML = inData[inData.length-1].year;
              
     //         render();

         }   