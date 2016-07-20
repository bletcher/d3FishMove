
var watershed = {
  WB: {
    
    nextDown: [ 2,2,4,4,6,6,7,0 ], // Contiguous downstream river for each index (river #)
    terminalTrib: [ 1,1,0,1,0,1,0,0 ], // Is the river a terminal trib (eg.g no upstream movement possible)
    emigrationRiver: "WB", 
    emigrationRiverN: 7,
    emigrationSection: -1,
    emigrationSectionN: 1,
    scaleRiverNtoRiver: d3.scaleOrdinal().domain(d3.range(0,8)).range(["WB","IL","WB","OL","WB","OS","WB","Em"]),
    uniqueRivers: ["WB","IL","OL","OS","Em"],
    scaleRivertoRiverHeatMap: d3.scaleOrdinal().domain(["WB","IL","OL","OS","Em"]).range([0,1,2,3,4]),
    sppScale: d3.scaleOrdinal().domain(["ats","bnt","bkt"]).range(["Atlantic salmon", "Brown trout", "Brook trout"]),
    sppScaleColor: d3.scaleOrdinal().domain(["ats","bnt","bkt"]).range([d3.rgb(162,205,174), d3.rgb(74,116,134), d3.rgb(36,45,66)]),
    riverLabelXY: {
      wb: {x: width * 0.13, y: height * 0.5},
      ol: {x: width * 0.85, y: height * 0.10},
      os: {x: width * 0.60, y: height * 0.6},
      il: {x: width * 0.35, y: height * 0.2},
      em: {x: width * 0.13, y: height * 0.94}
    }
  },
  SB: {
    nextDown: [ 2,2,3,4,0 ],
    terminalTrib: [ 1,1,0,0,0 ],
    emigrationRiver: "tidal", 
    emigrationRiverN: 4,
    emigrationSection: -1,
    emigrationSectionN: 1,
    scaleRiverNtoRiver: d3.scaleOrdinal().domain(d3.range(0,5)).range(["west","east","mainstem","tidal","em"]),
    uniqueRivers: ["Main","West","East","Tide","Em"],
    scaleRivertoRiverHeatMap: d3.scaleOrdinal().domain(["mainstem","west","east","tidal","em"]).range([0,1,2,3,4]),
    sppScale: d3.scaleOrdinal().domain(["ats","bnt","bkt"]).range(["Atlantic salmon", "Brown trout", "Brook trout"]),
    sppScaleColor: d3.scaleOrdinal().domain(["ats","bnt","bkt"]).range([d3.rgb(162,205,174), d3.rgb(74,116,134), d3.rgb(36,45,66)]),
    riverLabelXY: {
      mainstem: {x: width * 0.25, y: height * 0.45},
      east:     {x: width * 0.92, y: height * 0.25},
      west:     {x: width * 0.76, y: height * 0.6},
      tidal:    {x: width * 0.06, y: height * 0.67},
      em:       {x: width * 0.02, y: height * 0.93}
    },
  }
};



