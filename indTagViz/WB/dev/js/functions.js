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
  
  
  function initializeInterface(){
  
     $("#all").on("click", function () {
       console.log("#all click");
       getXY("all");
       simulation.alpha(1).nodes(state.counts).restart(); 
     });
     $("#species").on("click", function () {
       console.log("#species click");
       getXY("species");
       simulation.alpha(1).nodes(state.counts).restart();
     });
     $("#river").on("click", function () {
       console.log("#river click");
       getXY("river");
       simulation.alpha(1).nodes(state.counts).restart();
     });
     $("#season").on("click", function () {
       console.log("#season click");
       getXY("season");
       simulation.alpha(1).nodes(state.counts).restart();
     });
     $("#year").on("click", function () {
       console.log("#year click");
       getXY("year");
       simulation.alpha(1).nodes(state.counts).restart();
     });
     $("#seasonYear").on("click", function () {
       console.log("#seasonYear click");
       getXY("seasonYear");
       simulation.alpha(1).alphaMin(0.01).nodes(state.counts).restart();
     });
//
     $("#colorSpecies").on("click", function () {
       console.log("#colorSpecies click");
       state.counts.forEach(function(d){ d.color = sppColor( d.species )  });
       ticked();
       contextL.clearRect(0, 0, canvasL.width, canvasL.height);
       spp.forEach(function(d,i) {drawLegend(d,i,"species")});
     });
     $("#colorRiver").on("click", function () {
       console.log("#colorSpecies click");
       state.counts.forEach(function(d){ d.color = riverColor( d.river )  });
       ticked();
       contextL.clearRect(0, 0, canvasL.width, canvasL.height);
       riv.forEach(function(d,i) {drawLegend(d,i,"river")});
     });
     $("#colorSeason").on("click", function () {
       console.log("#colorSeason click");
       state.counts.forEach(function(d){ d.color = seasonColor( d.season )  });
       ticked();
       contextL.clearRect(0, 0, canvasL.width, canvasL.height);
       sea.forEach(function(d,i) {drawLegend(d,i,"season")});
     }); 
     $("#colorYear").on("click", function () {
       console.log("#colorYear click");
       state.counts.forEach(function(d){ d.color = yearColor( d.year )  });
       ticked();
       contextL.clearRect(0, 0, canvasL.width, canvasL.height);
       yea.forEach(function(d,i) {drawLegend(d,i,"year")});
     });
  }

  function initializeXY(w,h){
    var xProp4 = [0.25,0.5,0.75], yProp4 = [0.25,0.5,0.75];
    var xProp3 = [0.33,0.66], yProp3 = [0.33,0.66];
    
    xy = {
      all: [ w*xProp4[1], h*yProp4[1] ],
      species: {
        ats: [w*xProp4[1], h*yProp4[1]],
        bkt: [w*xProp3[0], h*yProp3[0]],
        bnt: [w*xProp3[1], h*yProp3[0]]
      },
      river: {
        WB: [w*xProp4[0], h*yProp4[0]],
        OL: [w*xProp4[0], h*yProp4[2]],
        OS: [w*xProp4[2], h*yProp4[0]],
        IL: [w*xProp4[2], h*yProp4[2]]
      },
      season: {
        Spring: [w*xProp3[0], h*yProp3[0]],
        Summer: [w*xProp3[0], h*yProp3[1]],
        Autumn: [w*xProp3[1], h*yProp3[0]],
        Winter: [w*xProp3[1], h*yProp3[1]]
      }
    };
  }

  function initializeFishData(cd){
      console.log("initializefishData");

    spp = sortUnique(cd.map(function(d){return d.species}));
    riv = sortUnique(cd.map(function(d){return d.river}));
    sea = sortUnique(cd.map(function(d){return d.season}));
    yea = sortUnique(cd.map(function(d){return d.year}));
    
    state.counts = [];
    indx = 0;
    for (var s in spp){
      for (var r in riv){
        for (var s2 in sea){
          for (var y in yea){
       
            var subset = getDataSRSY(cd,spp[s],riv[r],sea[s2],yea[y]);
            var numLines = parseInt(subset.length / fishPerCircle);
            
        //    console.log(indx,spp[s],riv[r],sea[s2],yea[y],subset,subset.length,numLines)
            
            for( var i = 0; i < numLines; i++){
           
              state.counts[indx] = { species: spp[s], river: riv[r], season: sea[s2], year: yea[y] };
          //    console.log(i,indx,spp[s],riv[r],sea[s2],yea[y],subset,subset.length,numLines)
              indx = indx + 1;
            }
  
          }
        }
      }
    }         
    console.log("initializefishData - done");
    state.counts.forEach(function(d){ d.color = sppColor( "bnt" ) }); 
  }

 function getDataSRSY(d,spp,riv,sea,yea){
   return d.filter( function(dd) {
     return dd.species == spp && dd.river == riv && dd.season == sea && dd.year == yea ;
   });
 }

  function getXY(scenario){
    var y = uniques(state.counts.map(function(d){return d.year}));
    var stepWidth = width/(y.length + 1);
    
    var s = ["Spring", "Summer", "Autumn", "Winter"]; //uniques(state.counts.map(function(d){return d.season[0]}));
    var stepHeight = height/(s.length + 1);
    
      state.counts.forEach(function(d){
        
        switch(scenario){
          case "all":
            d.xx = xy.all[0];
            d.yy = xy.all[1];
          break;
          
          case "species":
            switch(d.species){
              case "ats":
                d.xx = xy.species.ats[0];
                d.yy = xy.species.ats[1];
                break;
              case "bkt":
                d.xx = xy.species.bkt[0];
                d.yy = xy.species.bkt[1];
                break;
              case "bnt":
                d.xx = xy.species.bnt[0];
                d.yy = xy.species.bnt[1];
                break;
            }
          break;
          
          case "river":
            switch(d.river){
              case "WB":
                d.xx = xy.river.WB[0];
                d.yy = xy.river.WB[1];
                break;
              case "OL":
                d.xx = xy.river.OL[0];
                d.yy = xy.river.OL[1];
                break;
              case "OS":
                d.xx = xy.river.OS[0];
                d.yy = xy.river.OS[1];
                break;
              case "IL":
                d.xx = xy.river.IL[0];
                d.yy = xy.river.IL[1];
                break;
            }
          break;
          
          case "season":
            switch(d.season){
              case "Spring":
                d.xx = xy.season.Spring[0];
                d.yy = xy.season.Spring[1];
                break;
              case "Summer":
                d.xx = xy.season.Summer[0];
                d.yy = xy.season.Summer[1];
                break;
              case "Autumn":
                d.xx = xy.season.Autumn[0];
                d.yy = xy.season.Autumn[1];
                break;
              case "Winter":
                d.xx = xy.season.Winter[0];
                d.yy = xy.season.Winter[1];
                break;
            }
          break;
          
          case "year":
            d.xx =  y.indexOf(d.year) * stepWidth + stepWidth;
            d.yy = height * 0.6;
          break;
          
          case "seasonYear":
            d.xx =  y.indexOf(d.year) * stepWidth + stepWidth;
            d.yy = s.indexOf(d.season) * stepHeight + stepHeight;
          break;
        }
        
      });
    }

  function ticked() {
  //  console.log(state.currentSample,simulation.alpha())
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(margin.left, margin.top); // subtract the margin values whenever use simulation.find()
  
    state.counts.forEach(drawNode);
    
    context.restore();
  }
  
  function drawNode(d){ 
      context.beginPath();
      context.arc( d.x, d.y, initialRadius, 0, 2 * Math.PI);

      context.strokeStyle = d.color;//"grey";
      context.stroke();
      context.fillStyle = d.color;//"grey";
      context.fill();

  }
  
  function drawLegend(d,i,variable){
    // move to global variables?

     switch(variable){
      case "species":
        col = d3.rgb(sppColor( d ));
        txt = sppScale(d);
        numRows = spp.length;
        break;
      case "river":
        col = d3.rgb(riverColor( d ));
        txt = d;
        numRows = riv.length;
        break;
      case "season":
        col = d3.rgb(seasonColor( d ));
        txt = d;
        numRows = sea.length;
        break;
      case "year":
        col = d3.rgb(yearColor( d ));
        txt = d;
        numRows = yea.length;
        break;
    }
    
    // scale the legend canvas to # or rows
    var vOffset = 25;
//    canvasL.height = vOffset*numRows;
//    heightL = canvasL.height - marginL.top - marginL.bottom; 
    
    var radius = 5; vOffsetText = radius/2;
    var w = 10, h = (heightL/2 + vOffset*numRows/2) - vOffset * i;
    var col, txt, numrows;
    
    contextL.beginPath();
    contextL.arc(w, h, radius, 0, 2 * Math.PI);
    contextL.strokeStyle = col.darker(2);
    contextL.stroke();
    contextL.fillStyle = col;
    contextL.fill();
    contextL.font = "16px calibri";
    contextL.fillText(txt ,w + 20, h + vOffsetText);
  }

  
 function getDataEnc(d){
   return d.filter( function(dd) {
     return dd.enc == 1;
   });
 }

 function getDataIdLessThan(d,maxId){
   return d.filter( function(dd) {
     return dd.id < maxId;
   });
 }

 function getDataIdBtw(d,minId,maxId){
   return d.filter( function(dd) {
     return dd.id < maxId && dd.id > minId;
   });
 }



  function clickSubject() {
    console.log("mouseClickSubject",d3.event.x,d3.event.y,simulation.find(d3.event.x - margin.left, d3.event.y - margin.top, searchRadius));
    return simulation.find(d3.event.x - margin.left, d3.event.y - margin.top, searchRadius);
  }

  function clickDot(){
  
    var d = clickSubject();
    console.log("selected",d.id);
  
  }
  
  function mouseMoved() {
    var a = this.parentNode, 
        m = d3.mouse(this), 
        d = simulation.find(m[0]- margin.left , m[1]- margin.top , searchRadius);

    if (!d) return a.removeAttribute("title"), tooltip.style('visibility','hidden');
/*
    var buildText = d.id + " " + d.tag + '\n' ;
    
      d.sample.forEach(function(dd,i){
        var tmp = [dd].concat([d.river[i], d.year[i], d.season[i], d.section[i], d.age[i], d.len[i]]) +'\n';
        if (dd == state.currentSample + 1) tmp = "*" + tmp;
        buildText = buildText + tmp; 
      });
*/
    a.setAttribute("title", d.river + " " + d.species + " " + d.season + " " + d.year);

    tooltip
      .style("visibility", "visible");
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
  
  
  
  
  
  