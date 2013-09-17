function set_default(x, default_val) {
  return typeof(x) === "undefined" ? default_val : x;
}

function lookup_by_id(data, id, attribute) {
  var filtered = data.filter(function(d) { return d.id == id; });
  return filtered[0][attribute];
}
