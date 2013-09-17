function _show_label(d) {
  if (d.hasOwnProperty("label")) {
    var label = d.label;
    var the_event = d3.event;
    console.log (label);
  }
}


function add_labels() {
  d3.selectAll(".node").on("mouseover", _show_label);
}