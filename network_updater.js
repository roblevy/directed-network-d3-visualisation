function _update_nodes(nodes) {
  nodes.transition()
  .select("circle").transition()
    .duration(__transition_duration__)
    .attr("r", _get_radius)
    .style("stroke-width", _node_stroke_width);
}

function _update_links() {
  var max_value = svg.attr("max_link_value");

  d3.selectAll(".link_and_followers .link")
    .transition()
      .duration(__transition_duration__)
      .attr("stroke-width", function (d) { 
        return d.value / max_value * __max_link_width__;
      });
  _resize_path_followers();
}

function _resize_path_followers() {
  var max_value = svg.attr("max_link_value");
  d3.selectAll(".link_and_followers .path_follower")
      .transition().duration(__transition_duration__)
    .attr("transform", function(d) { 
        return "scale(" + d.value / max_value * __max_link_width__ + ")"; 
      });
}

function _exit_links(links) {
  links.selectAll(".link")
    .transition()
      .duration(__transition_duration__)
      .attr("stroke-width", 0)
  
  links.selectAll(".path_follower")
    .transition()
      .duration(__transition_duration__)
      .attr("transform", "scale(0)")
}

