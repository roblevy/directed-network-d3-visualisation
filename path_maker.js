var __curvature__ = 280;
var __radius_fraction__ = 10;
var __scale_up_factor__ = 0.05;
var line_gen = d3.svg.line().interpolate("basis");

// Create two dummy points for testing
// -----------------------------------

if (__debug_mode__) {
  var points = [[[100,400],[300,400]],
                [[300,80],[30,200]],
                [[30,200],[300,80]]];
  svg.selectAll("path").data(points)
        .enter().append("path")
     .attr("d", function(d) { 
      return curve_data(d, 2) })
     .style("fill", "none")
     .style("stroke", "black");
}
// -----------------------------------

// Take a pair of points, formatted like [[x1,y1],[x2,y2]]
// and draws a curve on the global svg object like this:
//
//        __radius_fraction__
//                |
//   ____________---   
//  /            \  | __curvature__
// /              \ |
function curve_data(points, scale_up) {
  scale_up = set_default(scale_up, 1.0);
  var line_data = _get_curve(points[0], points[1], scale_up);
  return line_gen(line_data);
}

function _get_curve(start,end, scale_up) {
  var midpoint = _get_curve_midpoint(start, end, scale_up);
  return [start, midpoint[0], midpoint[1], end];  
}

function _get_curve_midpoint(start, end, scale_up) {
  var x_1 = start[0],
      y_1 = start[1],
      x_2 = end[0],
      y_2 = end[1];
  var c = __curvature__ * (scale_up * __scale_up_factor__);
  var x_m1 = x_1 + ((x_2 - x_1) / __radius_fraction__), 
      y_m1 = y_1 + ((y_2 - y_1) / __radius_fraction__),
      x_m2 = x_1 + ((x_2 - x_1) * (1 - (1 / __radius_fraction__))),
      y_m2 = y_1 + ((y_2 - y_1) * (1 - (1 / __radius_fraction__)));
  
  var v_1 = [y_m1 - y_1, x_1 - x_m1],
      v_2 = [y_m2 - y_1, x_1 - x_m2];
  var mod_v_1 = Math.sqrt(Math.pow(v_1[0],2) + Math.pow(v_1[1],2)),
      mod_v_2 = Math.sqrt(Math.pow(v_2[0],2) + Math.pow(v_2[1],2));
  
  var x_z1 = x_m1 + c / mod_v_1 * v_1[0],
      y_z1 = y_m1 + c / mod_v_1 * v_1[1],
      x_z2 = x_m2 + c / mod_v_2 * v_2[0],
      y_z2 = y_m2 + c / mod_v_2 * v_2[1];
  
  return [[x_z1,y_z1],[x_z2,y_z2]];
}