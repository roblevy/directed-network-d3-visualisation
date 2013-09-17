var circle = svg.append("circle");
   // create the circle
   circle.attr("id", "to_animate")
	 .attr("cx",0)
	 .attr("cy",0)
         .attr("r", 1.2);

var basis_line = d3.svg.line()
                       .x(function(d) { 
                                        return d[0]; })
                       .y(function(d) { return d[1]; })
                       .interpolate("basis");

// Create a dummy path and dummy data for testing
// ----------------------------------------------------

if (__debug_mode__) {
  var dummy_start = [20,20],
      dummy_end = [500,500];
  var dummy_data = [dummy_start,[dummy_start[0],dummy_end[1]],dummy_end];

  var path = svg.append("path");
  path.attr("d", basis_line(dummy_data))
      .attr("stroke", "blue")
      .attr("stroke-width", 10)
      .attr("fill", "none");       
} 
// ----------------------------------------------------
 
function _match_style_object_to_path(object, path) {
  object.attr("fill", path.attr("stroke"))
        .attr("scale_factor", path.attr("stroke-width"));
}

function _animate_along_path(object, path, duration, offset) {
  duration = set_default(duration, 6);
  offset = set_default(offset, 0);
  
  _match_style_object_to_path(object, path);
  object.append("animateMotion")
          .attr("dur",duration)
          .attr("begin", offset)
          .attr("repeatCount", "indefinite")
          .attr("rotate", "auto")
          .attr("path", path.attr("d"));
}

function _pulse_object(object, scale, duration) {
  duration = set_default(duration, 0.5);
  var from = object.attr("scale_factor");
  if (scale != 1.0) {
    var to = from * scale;
    object.append("animateTransform")
          .attr("attributeName", "transform")
          .attr("attributeType", "XML")
          .attr("type", "scale")
          .attr("values", from + ";" + to + ";" + from)
          .attr("dur", duration)
          .attr("repeatCount", "indefinite");
  } else {
    object.attr("transform", "scale(" + from + ")");
  }
}

function _clone_object(object, i, svg_group) {
	// i is an index for adding a number to the id of the new DOM element
	var attr = object.node().attributes;
	var length = attr.length;
	var node_name = object.property("nodeName");
	if (typeof(svg_group) === "undefined") {
    svg_group = d3.select(object.node().parentNode);
  }
	var cloned = svg_group.append(node_name)
			     .attr("id", object.attr("id") + i);
	for (var j = 0; j < length; j++) {
    if (attr[j].name != "id") {
      cloned.attr(attr[j].name,attr[j].value);
    }
	}
	return cloned;
}

// This is the only function you should need to use. It
// takes an 'object', a D3 selection containing a single DOM element
// and clones it 'n' times, animating all the clones along the 'path'.
// 'duration': default 3. Number of seconds the whole animation should take
// 'pulse': set to false if you don't want the objects to pulse
// 'pulse_size': default 1.15. The size to scale up to at the top of the pulse
// 'pulse_duration': default 0.5. Number of seconds
function animate_objects_along_path(object, 
                                      path, 
                                      svg_group,
                                      n, duration, 
                                      pulse, pulse_size,
                                      pulse_duration) {
  
  // Defaults
  pulse = set_default(pulse, false);
  pulse_size = set_default(pulse_size, 1.0); // 1.5);
  duration = set_default(duration, 3);
  pulse_duration = set_default(pulse_duration, 0.5);
  n = set_default(n, 4);
  // --------
  object.classed("path_follower", true);
  _match_style_object_to_path(object, path);
  var start_delay = 0;
  for (var i = 0; i < n; i++) {
    var object_copy = _clone_object(object, i, svg_group);
    _match_style_object_to_path(object_copy, path);
    _animate_along_path(object_copy, path, duration, start_delay);
    _pulse_object(object_copy, pulse_size, pulse_duration);
    start_delay += (duration / n);
  }
  // Hide the original object
  //object.style("visibility", "hidden");
}

if (__debug_mode__) {
  //animate_objects_along_path(circle, path);
};