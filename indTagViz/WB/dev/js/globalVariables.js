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


var sppText = " <u>Brook trout</u> are native and reproduce naturally.</p>  <u>Brown trout</u> reproduce naturally, but were introduced from Europe in the mid 1800’s.</p>  <u>Atlantic salmon</u> were native but do not reproduce naturally. They were stocked as 25 mm fry in the spring.";

var riverText = " <u>WB</u> is the mainstem and has the most area. </p>  <u>OL</u> is a Large, Open tributary, with a  fully passable culvert. </p>  <u>OS</u> is a Small, Open tributary, with a perched culvert until the Nature Conservancy replaced it in 2013. </p>  <u>IL</u> is a Large, Isolated tributary with an impassable waterfall at the confluence with WB";

var riverText2 = " All three species lived in the <u>WB</u>. </p>  <u>OL</u> had mostly brook trout with some brown trout. </p>  <u>OS</u> was almost all brook trout. </p>  <u>IL</u> contained only brook trout.";

var stepText = [
  "dummy",
  "From 1997 to 2015, we tagged almost 30,000 individual fish. </p> Those fish were captured a total of 63,232 times, many just once, some up to 10 times. </p> In the dot cloud, each circle is 25 fish captures.",
  "There were three <b>species</b> of fish in the stream. </p>" + sppText,
  "There were four <b>rivers</b> in the stream network. </p>" + riverText,
  "There were four <b>rivers</b> in the stream network. </p>" + riverText2,
  "We sampled for 19 <b>years</b>.",
  "We sampled four <b>seasons</b> over the 19 <b>years</b>. </p> Some years we couldn't sample in the winter because of ice.",
  "Explore the data by yourself by clicking buttons to <u>position</u> and <u>color</u> the circles. </p> Many combinations are possible."
];
