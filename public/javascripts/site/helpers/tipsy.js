function hideTipsy() {
  window["cancel.tipsy"] = false;
  $("body").css({cursor: "default"});
  setTimeout(function() {
      if (window["cancel.tipsy"] || !window["active.tipsy"]) return;
      var tip = window["active.tipsy"];
      tip.remove();
  }, 100);
}

function showLabel(feature){
  var coords = feature.layer.getViewPortPxFromLonLat(feature.geometry.bounds.getCenterLonLat());
  window["cancel.tipsy"] = true;

  var tip = window["active.tipsy"];
  if (!tip) {
      tip = $('<div class="tipsy"><div class="tipsy-inner"/></div>');
      tip.css({position: 'absolute', zIndex: 100000});
      window["active.tipsy"] = tip;
  }

  tip.find('.tipsy-inner')['html'](feature.attributes["name"]);

  var pos = {top: coords.y + 70, left: coords.x + 28, width: 24, height: 24};
  tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).appendTo(document.body);
  var actualWidth = tip[0].offsetWidth, actualHeight = tip[0].offsetHeight;
  tip.css({top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}).addClass('tipsy-south');

  tip.css({visibility: 'visible'});
}
