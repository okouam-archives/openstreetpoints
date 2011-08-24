$.Class.extend("Route", {

  init: function(data) {
    var geojson_format = new OpenLayers.Format.GeoJSON();
    this.linestrings = geojson_format.read(data);
  },

  describeTurn: function(turn, end) {
    var angle = turn < 0 ? 360 + turn : turn;
    var instruction;
    if ($.trim(end) == "") end = "";
    if (angle >= 45 && angle < 135) {
      instruction = ["turn_right.png", end == "" ? "Prendre &agrave; droite" : "Prendre &agrave; droite sur " + end];
    } else if (angle >= 135 && angle < 225) {
      instruction = ["straight.png", end == "" ? "Faire demi-tour" : "Faire demi-tour sur " + end];
    } else if (angle >= 225 && angle < 315) {
     instruction = ["turn_left.png", end == "" ? "Prendre &agrave; gauche" : "Prendre &agrave; gauche sur " + end];
    } else {
      instruction = ["straight.png", end == "" ? "Continuer tout droit" :  "Continuer sur " + end];
    }
    return instruction;
  },

  getDirections: function() {
    var description = this.generateRouteDescription();
    var list = "<li class='route-endpoint'><img src=\"/assets/images/start.png\"/><span>" + $(".departure").find(":text").val() + "</span></li>";
    $.each(description, function(index, item) {
      var className = index % 2 == 0 ? "odd" : "even";
      var image = "<img src=\"/assets/images/" + item[0] + "\" />";
      list += "<li class='" + className + "'>" + image + "<span>" + item[1] + "</span></li>";
    });
    list += "<li class='route-endpoint'><img src=\"/assets/images/end.png\"/><span>" + $(".arrival").find(":text").val() + "</span></li>";
    return list;
  },

  generateRouteDescription: function() {
    var directions = [];
    for(var i = 1; i < this.linestrings.length - 2; i++) {
      var start = this.linestrings[i].data;
      var end = this.linestrings[i + 1].data;
      if (start.label != "" && start.label == end.label) {
        // do nothing, still on same road
      } else {
        var turn = end.start_angle - start.end_angle;
        directions.push(this.describeTurn(turn, end.label));
      }
    }
    return directions;
  }
});