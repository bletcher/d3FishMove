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
       simulation.alpha(1).alphaMin(0.01).nodes(state.nodes).restart(); 
     });
     $("#species").on("click", function () {
       console.log("#species click");
       getXY("species");
       simulation.alpha(1).alphaMin(0.01).nodes(state.nodes).restart();
     });
     $("#river").on("click", function () {
       console.log("#river click");
       getXY("river");
       simulation.alpha(1).alphaMin(0.01).nodes(state.nodes).restart();
     });
     $("#season").on("click", function () {
       console.log("#season click");
       getXY("season");
       simulation.alpha(1).alphaMin(0.01).nodes(state.nodes).restart();
     });
     $("#year").on("click", function () {
       console.log("#year click");
       getXY("year");
       simulation.alpha(1).alphaMin(0.01).nodes(state.nodes).restart();
     });
     $("#seasonYear").on("click", function () {
       console.log("#seasonYear click");
       getXY("seasonYear");
       simulation.alpha(1).alphaMin(0.01).nodes(state.nodes).restart();
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

      byFish = d3.nest()
                 .key(function(d){return d.id;}).sortKeys(d3.ascending)
                 .entries(cd);
      
      state.nodes = byFish.map(function (d) {
                   return {
                     id: d.values[0].id,
                     tag: d.values[0].tag,
                     river: d.values.map(function(dd) {
                       return dd.river;
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
                   };
                 });
                 
  }

  function getXY(scenario){
    var y = uniques(state.nodes.map(function(d){return d.year[0]}));
    var stepWidth = width/(y.length + 1);
    
    var s = ["Spring", "Summer", "Autumn", "Winter"]; //uniques(state.nodes.map(function(d){return d.season[0]}));
    var stepHeight = height/(s.length + 1);
    
      state.nodes.forEach(function(d){
        
        switch(scenario){
          case "all":
            d.xx = xy.all[0];
            d.yy = xy.all[1];
            d.color = d3.rgb(74,116,134);
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
            d.color = sppScaleColor( d.species );
          break;
          
          case "river":
            switch(d.river[0]){
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
            d.color = sppRiverColor( d.river[0] );
          break;
          
          case "season":
            switch(d.season[0]){
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
            d.color = sppSeasonColor( d.season[0] );
          break;
          
          case "year":

            d.xx =  y.indexOf(d.year[0]) * stepWidth + stepWidth;
            d.yy = height * 0.6;
            
            d.color = sppScaleColor( "bnt" ); //just one color for now
          break;
          case "seasonYear":

            d.xx =  y.indexOf(d.year[0]) * stepWidth + stepWidth;
            d.yy = s.indexOf(d.season[0]) * stepHeight + stepHeight;
            
            d.color = sppScaleColor( "bnt" ); //just one color for now
          break;
        }
        
      });
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
    a.setAttribute("title", d.river[0] + " " + d.species + " " + d.season[0] + " " + d.year[0]);

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
  
  
  
  
  
  