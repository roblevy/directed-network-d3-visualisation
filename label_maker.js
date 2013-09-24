function _show_label(d) {
  var transition_duration = 500;
  if (d.id == d.parent & d.hasOwnProperty("label")) {
    if (d3.select(this).selectAll("text").empty()) {
      var label = d3.select(this).append("text");
      label
        .attr("text-anchor", "middle")
        .text(d.label)
        .style("font-size","0px");
        
      var t_grow = label.transition()
        .duration(transition_duration)
        .style("font-size","120px")
        .style("opacity", 0.3);
    }
  }
}


function add_labels() {
  d3.selectAll("g.node").each(_show_label);
}

function calculate_text_size(d) {
  var size_rescale = 5.0;
  return Math.sqrt(d.size) * size_rescale + "px";
}

// Hat tip to a question on Stack Overflow for this.
//http://stackoverflow.com/questions/10144934/transition-font-size-on-chrome-after-zoom-in
function _font_size_tween(d) {
  return d3.interpolate(
    this.style.getPropertyValue("font-size"),
    calculate_text_size(d)
  );
}