// Health: age, income, risks

var svgWidth = 960;
var svgHeight = 500;

// Create an SVG wrapper, append an SVG group that will hold our chart,
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create chart area and shift the latter by left and top margins.
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// total Chart width and height, will be used for SCALING
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Load CSV data
d3.csv("./assets/data/data.csv").then(function(healthdata) {

  //Convert string data to numeric data
    healthdata.forEach(function(data) {
      data.poverty = parseFloat(data.poverty);
      data.age = parseFloat(data.age);
      data.smokes = parseFloat(data.smokes);
      data.healthcare = parseFloat(data.healthcare);
    });

  //Create Scale for y-axis using %lacking health insurance
  var ydatamin=d3.min(healthdata, data => data.healthcare)-1
  var ydatamax=d3.max(healthdata, data => data.healthcare)

  var yScale = d3.scaleLinear()
  .domain([ydatamin, ydatamax])
  .range([height, 0]);

  //Create Scale for x-axis using poverty
  var xdatamin=d3.min(healthdata, data => data.poverty)-1
  var xdatamax=d3.max(healthdata, data => data.poverty)

  var xScale = d3.scaleLinear()
  .domain([xdatamin, xdatamax])
  .range([0, width]);

  // Create initial axis functions
  var leftAxis = d3.axisLeft()
    .scale(yScale);
  var bottomAxis = d3.axisBottom()
    .scale(xScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis); 

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthdata)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.poverty))
  .attr("cy", d => yScale(d.healthcare))
  .attr("r", 14)
  .attr("fill", "red")
  .attr("opacity", ".5");

  // add text to circle locations
  var text = chartGroup.selectAll("#text-label")
  .data(healthdata)
  .enter()
  .append("text")
  .attr("x", d => xScale(d.poverty))
  .attr("y", d => yScale(d.healthcare))
  .text(d => d.abbr)
  .attr("font-family", "sans-serif")
  .attr("font-size", "10px")
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .attr("font-weight","bold");

  // Add X axis label:
  chartGroup.append("text")
  .attr("text-anchor", "end")
  .attr("x", width/2)
  .attr("y", height + margin.top + 20)
  .attr("font-weight","bold")
  .text("Poverty %");

  // Y axis label:
  chartGroup.append("text")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-90)")
  .attr("y", -margin.left+60)
  .attr("x", -margin.top-60)
  .attr("font-weight","bold")
  .text("% Lacking health insurance");

});
