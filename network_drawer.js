var __max_node_size__ = 80;
var __max_link_width__ = 15;
var __max_node_stroke_width__ = 8;

var colours = d3.scale.category10();
// Design the path follower:
var __s = 2.2
var path_follower_shape = svg.append("path")
                               .attr("d", ("m 0 __s l __s -__s l -__s -__s "
                                         + "l __s 0 l __s __s l -__s __s z").replace(/__s/g,__s));
// var path_follower_shape = svg.append("path")
                               // .attr("d", ("m 0 __s l __s -__s l -__s -__s "
                                         // + "l " + 2 * __s + " __s z").replace(/__s/g,__s));
// Create a test set of nodes and links
// ------------------------------------
if (__debug_mode__) {
  
  data = {
    "nodes":[
              {"id":1,"group":1,"x":280,"y":600,"size":10,"label":"A", "parent":5},
              {"id":2,"group":2,"x":100,"y":300,"size":40,"label":"B", "parent":5},
              {"id":3,"group":3,"x":600,"y":420,"size":100,"label":"C", "parent":5},
              {"id":4,"group":4,"x":600,"y":80,"size":80,"label":"D", "parent":5}
            ],
    "links":[
              {"id":1,"source": 1, "target": 2, "value": 300},
              {"id":2,"source": 3, "target": 2, "value": 100},
              {"id":3,"source": 2, "target": 3, "value": 200},
              {"id":4,"source": 1, "target": 4, "value": 120},
              {"id":5,"source": 1, "target": 3, "value": 30},
              {"id":6,"source": 4, "target": 2, "value": 150},
              {"id":8,"source": 2, "target": 1, "value": 40},
              {"id":9,"source": 4, "target": 3, "value": 290},
              {"id":10,"source": 3, "target": 4, "value": 80},
              {"id":11,"source": 2, "target": 4, "value": 40}
            ]
  };
  draw_network(data);
}

// ------------------------------------

function draw_network(data, svg_group_name, max_values, show_network) {
  // Defaults
  // --------
  svg_group_name = set_default(svg_group_name, "main_group");
  max_values = set_default(max_values, _max_network_values(data));
  show_network = set_default(show_network, true);
  // --------
  var group = svg.append("g")
                   .attr("id", svg_group_name)
                   .classed("network", true)
                   .attr("visibility", function() {
                     if (show_network) {
                       return "visible";
                     } else {
                       return "hidden";
                     }
                   });
  var links_group = group.append("g")
                           .attr("id", "links");
  var nodes_group = group.append("g")
                           .attr("id","nodes");
  // Nodes
  _draw_nodes(data.nodes, nodes_group, max_values.node_size);
  // Links
  if (data.links.length > 0 ) {
    _set_link_groups(data);
    _set_scale_up(data);
    _draw_links(data.links, links_group, max_values.link_value);
  }
}

function _draw_nodes(nodes, g, max_size) {
  
  // Defaults
  // --------
  max_size = set_default(max_size, d3.max(nodes, function(d) { return d.size; }));
  // --------

  // Add a radius element to the data:
  nodes.forEach(function (d) { d["radius"] = Math.sqrt(d.size / max_size) * __max_node_size__; })
  // Draw nodes
  var drawn_nodes = g.selectAll("circle")
                       .data(nodes, function(d) { return d.id; } )
                     .enter().append("circle");
  // Work with the nodes                         
  drawn_nodes.classed("node", true)
             .attr("cx", function (d) { return d.x; })
             .attr("cy", function (d) { return d.y; })
             .attr("r", function (d) { return d.radius; })
             .attr("node-id", function (d) { return d.id; })
             .attr("id", function(d) { return "node" + d.id; })
             .attr("label", function(d) { return d.label; })
             .style("fill", function(d) {
               if (d.hasOwnProperty("colour")) { return d.colour; }
               if (d.filled | !d.hasOwnProperty("filled")) { 
                  return colours(d.group); } else { return "white"; }
             })
             .style("stroke", function(d) {
               if (d.coloured | !d.hasOwnProperty("coloured")) { 
                  return "none" } else { return "grey"; }
             })
             .style("stroke-width", function(d) {
               if (!d.filled) {
                 return d.radius / __max_node_size__ * __max_node_stroke_width__ 
               }
             })             
}

function _draw_links(links, g, max_value) {
  
  // Defaults
  // --------
  max_value = set_default(max_value, d3.max(links, function(d) {return d.value}));
  // --------

  var each_link = g.selectAll("path").data(links)
                          .enter().append("g")
                        .attr("id", function(d,i) { return "link_" + i;});
  each_link.append("path")
            .attr("d", function(d) {
              data = [_node_xy(d.source),_node_xy(d.target)];
              return curve_data([data[0],data[1]], d.scale_up) })
            .classed("link", true)
            .attr("scale_up", function(d) { return d.scale_up; })
            .attr("id", function(d) { return "link" + d.source + "_" + d.target + "_" + d.group; })
            .attr("fill", "none")
            .attr("stroke", function (d) { return colours(d.group); })
            .attr("stroke-width", function (d) { 
              return d.value / max_value * __max_link_width__;
            })
            .each(function(d) {
              animate_objects_along_path(path_follower_shape, 
                                         d3.select(this), 
                                         d3.select(this.parentElement));
            });
}

function _set_link_groups(data) {
  data.links.filter(function(x) { return !(x.hasOwnProperty("group"));}).forEach(function(x) {
    x.group = lookup_by_id(data.nodes, x.source, "group");
  });
}

function _set_scale_up(data) {
  var links = data.links.sort(_sort_links);
  var scale_up = 1;
  links[0].scale_up = 1;
  for (var i = 1; i < links.length; i++) {
    if (links[i].source == links[i-1].source & links[i].target == links[i-1].target) {
      links[i].scale_up = ++scale_up;
    } else {
      links[i].scale_up = scale_up = 1;
    }
  }
}

function _sort_links(x,y) {
  if (x.source == y.source) {
    if (x.target < y.target) { return -1; }
    if (x.target > y.target) { return 1; }
    if (x.group < y.group) { return -1; }
    if (x.group > y.group) { return 1; }
    return 0;
  }
  if (x.source < y.source) { return -1; }
  if (x.source > y.source) { return 1; }
  return 0;
}

function _node_xy(id) {
  try
    {
      var data = _node_data(id)
      return [data.x, data.y];
    }
    catch(err)
    {
      console.log("failed to look up xy value for node " + id);
      console.log(err.stack)
    }
}

function _node_data(id) {
    try
    {
	return svg.select("#node" + id).datum();
    } 
    catch(err)
    {
	console.log("failed to look up data for node " + id);
    }
}

function _node_id(id, g) {
  return g.select("#node" + id).attr("node-id");
}

function _max_network_values(data) {
  max_values = {}
  max_values.link_value = d3.max(data, function(d) {return d.value});
  max_values.node_size = d3.max(data, function(d) { return d.size; });

  return max_values;
}
