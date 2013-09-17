// Create a dummy data set with countries, and trade flows
if (__debug_mode__) {
  var data = {
    "models":[
      {
        "nodes":
        [
          {"id":0,"x":98,"y":449,"size":20,"group":2,"parent":12},
          {"id":1,"x":204,"y":566,"size":40,"group":3,"parent":12},
          {"id":2,"x":66,"y":565,"size":35,"group":1,"parent":12}
        ],
        "links":
        [
            {"source": 0, "target": 2, "value": 300},
            {"source": 1, "target": 2, "value": 100},
            {"source": 2, "target": 0, "value": 200},
            {"source": 1, "target": 0, "value": 120},
            {"source": 0, "target": 1, "value": 30}    
        ]      
      },
      {
        "nodes":
        [
          {"id":0,"x":98,"y":449,"size":20,"group":2,"parent":12},
          {"id":1,"x":204,"y":566,"size":40,"group":3,"parent":12},
          {"id":2,"x":66,"y":565,"size":35,"group":1,"parent":12}
        ],
        "links":
        [
            {"source": 0, "target": 2, "value": 300},
            {"source": 1, "target": 2, "value": 100},
            {"source": 2, "target": 0, "value": 200},
            {"source": 1, "target": 0, "value": 120},
            {"source": 0, "target": 1, "value": 30}    
        ]      
      }
    ]
  };
  var data2 =
  {
    "nodes":
    [
      {"id":0,"x":98,"y":449,"size":20,"group":2,"parent":12},
      {"id":1,"x":204,"y":566,"size":40,"group":3,"parent":12},
      {"id":2,"x":66,"y":565,"size":35,"group":1,"parent":12},

      {"id":3,"x":132,"y":57,"size":25,"group":2,"parent":13},
      {"id":4,"x":75,"y":139,"size":25,"group":1,"parent":13},
      {"id":5,"x":40,"y":49,"size":10,"group":3,"parent":13},

      {"id":6,"x":710,"y":61,"size":15,"group":2,"parent":14},
      {"id":7,"x":808,"y":94,"size":25,"group":3,"parent":14},
      {"id":8,"x":772,"y":179,"size":25,"group":1,"parent":14},

      {"id":9,"x":792,"y":449,"size":50,"group":3,"parent":15},
      {"id":10,"x":802,"y":581,"size":35,"group":1,"parent":15},
      {"id":11,"x":659,"y":587,"size":25,"group":2,"parent":15},

      {"id":12,"x":268,"y":440,"size":95,"group":0,"parent":12},
      {"id":13,"x":252,"y":171,"size":60,"group":0,"parent":13},
      {"id":14,"x":632,"y":166,"size":65,"group":0,"parent":14},
      {"id":15,"x":631,"y":443,"size":110,"group":0,"parent":15}
    ],
    "links":
    [
        {"source": 0, "target": 2, "value": 300},
        {"source": 1, "target": 2, "value": 100},
        {"source": 2, "target": 0, "value": 200},
        {"source": 1, "target": 0, "value": 120},
        {"source": 0, "target": 1, "value": 30},
        {"source": 0, "target": 1, "value": 180},
        {"source": 5, "target": 4, "value": 100},
        {"source": 4, "target": 3, "value": 290},
        {"source": 3, "target": 4, "value": 80},
        {"source": 1, "target": 2, "value": 10},
        {"source": 7, "target": 6, "value": 100},
        {"source": 6, "target": 7, "value": 300},
        {"source": 4, "target": 5, "value": 120},
        {"source": 8, "target": 6, "value": 50},
        {"source": 8, "target": 7, "value": 180},
        {"source": 7, "target": 8, "value": 180},
        {"source": 5, "target": 4, "value": 100},
        {"source": 15, "target": 14, "value": 100, "group":3},
        {"source": 12, "target": 13, "value": 320, "group":1},
        {"source": 14, "target": 15, "value": 360, "group":2},
        {"source": 14, "target": 15, "value": 330, "group":3},
        {"source": 13, "target": 12, "value": 120, "group":1},
        {"source": 13, "target": 12, "value": 110, "group":2},
        {"source": 15, "target": 14, "value": 150, "group":2},
        {"source": 12, "target": 14, "value": 150, "group":2},
        {"source": 12, "target": 14, "value": 200, "group":3},
        {"source": 14, "target": 12, "value": 180, "group":1},
        {"source": 11, "target": 15, "value": 180, "group":2},
        {"source": 13, "target": 3, "value": 40, "group":2}
    ]
  }

  //initialise(data);
}

var show_model_number;
var json_data;
var __show_lines__ = true;
var g;

function initialise(data) {
  json_data = data;
  show_model_number = 0;
  g = svg.append("g")
        .attr("id", "network");
  g.append("g")
     .attr("id", "links");
  g.append("g")
     .attr("id","nodes");
  max_values = _max_values(data);
  svg.attr("max_node_size", max_values['node_size'])
     .attr("max_link_value", max_values['link_value']);
  draw_model(data.models[0])
}

function draw_model(data) {
  _set_node_attributes(data);
  draw_network(data, g);
}

function _set_node_attributes(data) {
  for (i in data.nodes) {
    var node = data.nodes[i];
    var is_top_level = _is_top_level(node);
    node.filled = !(is_top_level);
    node.coloured = !(is_top_level);
  }
}

function _is_top_level(node) {
  return node.id == node.parent;
}

function _top_level(data) {
  return _extract_network(data, function(x) { return x.id == x.parent; });
}

function _sub_levels(data, top_level) {
  var sub_levels = [];
  for (i in top_level.ids) {
    var id = top_level.ids[i];
    sub_levels.push(_extract_network(data, function(x) { return x.parent == id & x.id != x.parent;})); 
  }
  return sub_levels;
}

function _extract_nodes(data, filter) {
  return data.nodes.filter(filter);
}

function _extract_network(data, filter) {
  var network = {};
  network.nodes = data.nodes.filter(filter);
  network.ids = network.nodes.map(function(x) { return x.id; });
  network.links = _filter_links(data.links, network.ids);
  return network;
}

function _filter_links(links, node_ids) {
  var n = node_ids;
    return links.filter(function(x) { return n.indexOf(x.source) > -1; }); //& n.indexOf(x.target) > -1; });
}


function _draw_trade_network(countries, trade_flows) {

  for (c_id in countries) {
    var c = countries[c_id];
    var total_size = d3.sum(c.node_details, function(d) { return d.size; });
    c['size'] = total_size;
  };
  
  draw_network(null, countries, trade_flows, "countries", "scale(2) translate(-200,-100)", false);
  
}

function _max_values(data) {
  max_values = {}
  max_values.link_value = d3.max(data.models, function(model) {
    return d3.max(model.links, function(d) {return d.value})
  });
  max_values.node_size = d3.max(data.models, function(model) {
    return d3.max(model.nodes, function(d) { return d.size; });
  });
  return max_values;
}

function _increment_model_number() {
  show_model_number++;
  if (show_model_number >= json_data['models'].length) {
    show_model_number = 0;
  }
}