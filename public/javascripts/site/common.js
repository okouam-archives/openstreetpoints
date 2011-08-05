function centerOnLocation(feature) {
  feature.layer.map.setCenter(feature.geometry.bounds.getCenterLonLat(), 11, true, false);
  feature.layer.redraw();
}

function createSimpleList(locations) {
  return createListFromTemplate(locations, "locations.simple.ejs")
}

function addMapIcon(api_root, locations) {
  for(var i = 0; i < locations.length; i++) {
    locations[i].attributes["thumbnail"] = api_root + "/images/icons/" + (i + 1) + ".gif";
  }
  return locations;
}

function createList(locations) {
  return createListFromTemplate(locations, "locations.ejs")
}

function createListFromTemplate(locations, template) {
  var data = {items: []};
  for(var i = 0; i < locations.length; i++) {
    var attributes =  locations[i].attributes;
    var place = attributes["boundaries"]["0"]["name"];
    if (attributes["city_name"]) place = place + attributes["city_name"];
    var className = i % 2 == 1 ? "odd" : "even";
    var item = {className: className, place: place, name: attributes["name"], id: attributes["id"], fid: locations[i].fid};
    data.items.push(item);
  }
  return new EJS({url: "/javascripts/templates/" + template}).render(data);
}

function markFeaturesAsLocations(items) {
  $.each(items, function(index, item) {
    item.attributes["isLocation"] = true;
    item.fid = index;
  });
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
