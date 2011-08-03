function centerOnLocation(feature) {
  feature.layer.map.setCenter(feature.geometry.bounds.getCenterLonLat(), 11, true, false);
  feature.layer.redraw();
}

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

function bindSearchResults(container, featureLayer) {
  var results = container.find(".list-of-locations .content li a");
  results.live('click', function() {
    var feature = featureLayer.getFeatureByFid($(this).attr("href").substring(1));
    centerOnLocation(feature);
  });
  results.live('mouseover', function() {
    var feature = featureLayer.getFeatureByFid($(this).attr("href").substring(1));
    showLabel(feature);
  });
  results.live('mouseout', function() {
    hideTipsy();
  });
}

function clearCategories() {
  var container = $("#categories");
  hideLocationList(container);
  container.find("input").attr("checked", "");
}

function clearLocalization() {
  var container = $("#localization");
  hideLocationList(container);
  container.find("input[type='text']").val("");
}

function createSimpleList(api_root, locations) {
  var list = "";
  for(var i = 0; i < locations.length; i++) {
    var map_icon = api_root + "/images/icons/" + (i + 1) + ".gif";
    var loc = locations[i];
    loc.attributes["thumbnail"] = map_icon;
    var place = loc.attributes["boundaries"]["0"]["name"];
    if (loc["city_name"]) place = place + loc["city_name"];
    var className = "even";
    if (i % 2 == 1) className = "odd";
    list += "<li class='" + className + "'>"
            + "<div class='numbering' style='display: inline-block; float: left; width : 35px; text-align: right; padding-right: 10px; height:40px'><span>" + (i + 1) + "</span></div>"
            + "<a class='name' href='#" + loc.fid + "'>"
            + loc.attributes["name"]
            + "</a>"
            + "<br/><span>"
            +  place
            + "</span><div style='clear: both'></div></li>";
  }
  return list;
}

function createList(api_root, locations) {
  var list = "";
  for(var i = 0; i < locations.length; i++) {
    var map_icon = api_root + "/images/icons/" + (i + 1) + ".gif";
    var loc = locations[i];
    loc.attributes["thumbnail"] = map_icon;
    var place = loc.attributes["boundaries"]["0"]["name"];
    if (loc["city_name"]) place = place + loc["city_name"];
    var className = "even";
    if (i % 2 == 1) className = "odd";
    list += "<li class='" + className + "'>"
            + "<div class='numbering' style='display: inline-block; float: left; width : 35px; text-align: right; padding-right: 10px; height:40px'><span>" + (i + 1) + "</span></div>"
            + "<a class='name' href='#" + loc.fid + "'>"
            + loc.attributes["name"]
            + "</a>"
            + "<a class='details' href='#" + loc.attributes["id"] + "'><img src='/images/12-eye.png' alt='Fiche' /></a>"
            + "<a class='print' href='#" + loc.attributes["id"] + "'><img src='/images/185-printer.png' alt='Imprimer' /></a> "
            +"<br/><span>"
            +  place
            + "</span><div style='clear: both'></div></li>";
  }
  return list;
}

function markFeaturesAsLocations(items) {
  $.each(items, function(index, item) {
    item.attributes["isLocation"] = true;
    item.fid = index;
  });
}

function showLocations(data, featureLayer, container, msg) {
    removeLocationsFromMap(featureLayer);
    container.find(".cutoff-warning").empty();
    var wrapper = container.find("ul");
    wrapper.empty();
    var geojson_format = new OpenLayers.Format.GeoJSON();
    var locations = geojson_format.read(data);
    if (locations.length > 0) {
      markFeaturesAsLocations(locations);
      createList(wrapper, locations, msg);
      featureLayer.addFeatures(locations);
    }
  }

function removeLocationsFromMap(featureLayer) {
  var i, len = featureLayer.features.length, feature, foundFeatures = [];
  for( i = 0; i < len; i++ ) {
    feature = featureLayer.features[i];
    if(feature && feature.attributes){
      if (feature.attributes["isLocation"]) foundFeatures.push(feature);
    }
  }
  featureLayer.destroyFeatures(foundFeatures);
}

function getFeaturesByAttribute(featureLayer, attrName, attrValue) {
  var i, len = featureLayer.features.length, foundFeatures = [], feature;
  for( i = 0; i < len; i++ ) {
    feature = featureLayer.features[i];
    console.debug(feature);
    if( feature && feature.attributes ){
       if ( feature.attributes[attrName] === attrValue ) {
          foundFeatures.push(feature);
       }
    }
  }
  return foundFeatures;
}

function showCutoffWarning(msg) {
  $(".cutoff-warning").append("<p>" + msg + "</p>")
}