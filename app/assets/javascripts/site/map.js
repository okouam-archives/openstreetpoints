function setupBaseLayer(map) {
  var urls = [
    "http://a.maps.geocms.co/tilecache.py?",
    "http://b.maps.geocms.co/tilecache.py?",
    "http://c.maps.geocms.co/tilecache.py?"
  ];
  var base_layer = new OpenLayers.Layer.WMS("base", urls, {layers: "data01", format: "image/png"});
  map.addLayer(base_layer);
  return base_layer;
}

function setupMap(element) {
  OpenLayers.ImgPath = "/assets/OpenLayers/";
  OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
  var map = new OpenLayers.Map(element, {
      theme: null,
      maxResolution: 0.0109863281,
      numZoomLevels: 14,
      restrictedExtent: new OpenLayers.Bounds(-10.732494554375, 4, -1, 11.2542840375),
      maxExtent: new OpenLayers.Bounds(-62.6428949, -11.4905018, 49.85710501, 35.844773),
      controls: []
  });
  map.base_layer = setupBaseLayer(map);
  return map;
}

function setupFeaturesLayer(map) {
  var layer = new OpenLayers.Layer.Vector("Features");
  map.addLayer(layer);
  var style = new OpenLayers.Style({externalGraphic: '${thumbnail}', 'pointRadius': 10});
  layer.styleMap = new OpenLayers.StyleMap({'default': style, 'select': style});
  return layer;
}

function setupRouteLayer(map) {
  var layer = new OpenLayers.Layer.Vector("Route");
  map.addLayer(layer);
  var style = new OpenLayers.Style({strokeColor: "blue", strokeWidth: 4, strokeOpacity: 0.7});
  layer.styleMap = new OpenLayers.StyleMap({'default': style, 'select': style});
  return layer;
}

function setupMapControls(app, featureLayer) {
  var drag = new OpenLayers.Control.DragFeature(featureLayer, {
    onStart: function(feature) {
      if (!feature.attributes["isRouteMarker"]) this.cancel();
      if (app.route.representation != null) {
        app.featureLayer.removeFeatures([app.route.representation]);
      }
    },
    onComplete: function() {
      $("body").css({cursor: "default"});
      $(document).trigger("route.gowane", app);
    }
  });

  var tooltip = new OpenLayers.Control.SelectFeature(featureLayer, {
    hover: true,
    multiple: false,
    highlightOnly: true,
    overFeature: function(feature) {
      if (feature.attributes["isLocation"]) {
        showLabel(feature);
      }
      if (feature != app.route.representation) $("body").css({cursor: "pointer"});
    },
    outFeature: function() {
      hideTipsy();
    }
  });

  var panZoom = new OpenLayers.Control.PanZoomBar();
  panZoom.zoomWorldIcon = true;

  var controls = [tooltip, drag, panZoom, new OpenLayers.Control.DragPan(), new OpenLayers.Control.Navigation()];
  app.map.addControls(controls);
  $.each(controls, function (index, item) {
    item.activate();
  });
}
