function describeTurn(turn, end) {
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
}

function generateRouteDescription(linestrings) {
  var directions = [];
  for(var i = 1; i < linestrings.length - 2; i++) {
    var start = linestrings[i].data;
    var end = linestrings[i + 1].data;
    if (start.label != "" && start.label == end.label) {
      // do nothing, still on same road
    } else {
      var turn = end.start_angle - start.end_angle;
      directions.push(describeTurn(turn, end.label));
    }
  }
  return directions;
}