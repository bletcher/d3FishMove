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
      d.age = +d.age
      return d;
    }

function uniques(array) {
   return Array.from(new Set(array));
}

function assignSectionN(cd,xyIn){
// assign sectionN based on riverAbbr and section# 
// need to check lat/lon sor sections -1 and 0 in OS - just subtracted from the last decimal for now
  cd.forEach(function (d,i) {
    d.sectionN = xyIn.filter( function(dd) { return d.riverAbbr == dd.riverAbbr && d.section == dd.section })[0].sectionN
    d.riverN =   xyIn.filter( function(dd) { return d.riverAbbr == dd.riverAbbr && d.section == dd.section })[0].riverN
  
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
             riverHold = xy[path[d]].coordinates.slice().reverse()
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
  
  console.log(paths)
  return paths
}

function drawcoordinate (d, i) {
  d.coordinates.forEach( function (dd,ii) {
    context.moveTo(xScale(dd[0]), yScale(dd[1]));
    context.arc(   xScale(dd[0]), yScale(dd[1]), 10, 0, 2 * Math.PI);
  });
}

function drawNode (d, i) {
//console.log("drawnode",i,d);

  context.beginPath();
  context.moveTo(d.x, d.y );
  

  if( d.isFirstSample && simulation.alpha() < 0.2 ){  // keep new fish from entering from the upper left
    context.arc(   d.x, d.y, ageScale(d.age)*(1-simulation.alpha()/0.2), 0, 2 * Math.PI);
    context.fillStyle = d.color;
    context.fill();
    context.strokeStyle = d.color;
    context.stroke();
  }  
  else if (!d.isFirstSample) {
    context.arc(   d.x, d.y, ageScale(d.age), 0, 2 * Math.PI);
    context.fillStyle = d.color;
    context.fill();
    context.strokeStyle = d.color;
    context.stroke();
  } 
  
//  if(d.once){
//    context.strokeStyle = "black";
//    context.stroke();
//  }
}

// get path between the current and next time step
function getPath (nodesCurrentTmp) {
    nodesCurrentTmp.forEach(function (d,i) {
      
        var timeStepIndex = d.sample.indexOf(timeStep); // for all arrays in d
        
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
      
        var timeStepIndex = d.sample.indexOf(timeStep); // for all arrays in d
        
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

