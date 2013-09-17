var svg = d3.select("body").append("svg")
                             .attr("width",1500)
                             .attr("height",1500);
var current_node;
var colours = d3.scale.category10();
                             
svg.on("click",function() {
  if (d3.event.ctrlKey) {
    var mouse = d3.mouse(this);
    if (!(typeof(current_node) === "undefined")) {
      current_node.classed("selected",false);
    }
    current_node = svg.append("circle")
             .datum({"x":mouse[0],"y":mouse[1], "r":25, "group":1})
             .attr("cx", mouse[0])
             .attr("cy", mouse[1])
             .attr("r", function(d) { return d.r; })
             .call(node_drag)
             .classed("selected",true)
             .on("mousedown", function() {
               current_node.classed("selected",false);
               current_node = d3.select(this)
               current_node.classed("selected",true);
             })
             .on("dblclick", function(d) {
               d.group += 1;
               d3.select(this).style("fill", function(d) { return colours(d.group) });
             });
  }         
});

var node_drag = d3.behavior.drag()
                    .on("drag", drag_node);
                    
function drag_node(d) {
  d.x += d3.event.dx;
  d.y += d3.event.dy;
  d3.select(this)
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
}

svg.on("mousewheel", function() {
  current_node.datum().r += Math.round(d3.event.wheelDelta / 25);
  current_node.attr("r", function(d) { return d.r; });
  d3.event.preventDefault();
});

function spooloutdata() {
  data = []
  d3.selectAll("circle").each(function(d,i) {
    datum = {"id":d.id};
    for (j in d) {
      datum[j] = d[j];
    }
    data.push(datum);
  });
  return data;
}