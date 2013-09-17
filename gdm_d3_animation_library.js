// Global Constants
var __transition_duration__ = 1500;
var __max_node_size__ = 80;
var __max_link_width__ = 15;
var __max_node_stroke_width__ = 8;

function set_default(x, default_val) {
  return typeof(x) === "undefined" ? default_val : x;
}

function lookup_by_id(data, id, attribute) {
  var filtered = data.filter(function(d) { return d.id == id; });
  return filtered[0][attribute];
}
