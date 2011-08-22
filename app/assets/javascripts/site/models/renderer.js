$.Class.extend("Renderer", {

  init: function(element) {
    this.route = {};
    this.map = this.setupMap(element);
    this.map.zoomTo(0);
    this.layers = {route: this.setupRouteLayer(), features: this.setupFeaturesLayer()};
    this.setupMapControls(window.app, this.featureLayer);
  },

  setupBaseLayer: function(map) {
    var urls = [
      "http://a.maps.geocms.co/tilecache.py?",
      "http://b.maps.geocms.co/tilecache.py?",
      "http://c.maps.geocms.co/tilecache.py?"
    ];
    var base_layer = new OpenLayers.Layer.WMS("base", urls, {layers: "data01", format: "image/png"});
    map.addLayer(base_layer);
    return base_layer;
  },

  setupMap: function(element) {
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
    this.setupBaseLayer(map);
    return map;
  },

  setupFeaturesLayer: function() {
    var layer = new OpenLayers.Layer.Vector("Features");
    this.map.addLayer(layer);
    var style = new OpenLayers.Style({externalGraphic: '${thumbnail}', 'pointRadius': 10});
    layer.styleMap = new OpenLayers.StyleMap({'default': style, 'select': style});
    return layer;
  },

  setupRouteLayer: function() {
    var layer = new OpenLayers.Layer.Vector("Route");
    this.map.addLayer(layer);
    var style = new OpenLayers.Style({strokeColor: "blue", strokeWidth: 4, strokeOpacity: 0.7});
    layer.styleMap = new OpenLayers.StyleMap({'default': style, 'select': style});
    return layer;
  },

  setupMapControls: function() {
    var self = this;
    var drag = new OpenLayers.Control.DragFeature(self.layers.features, {
      onStart: function(feature) {
        if (!feature.attributes["isRouteMarker"]) this.cancel();
        if (self.route.representation != null) {
          self.layers.features.removeFeatures([self.route.representation]);
        }
      },
      onComplete: function() {
        $("body").css({cursor: "default"});
        $(document).trigger("route.gowane", app);
      }
    });

    var tooltip = new OpenLayers.Control.SelectFeature(self.layers.features, {
      hover: true,
      multiple: false,
      highlightOnly: true,
      overFeature: function(feature) {
        if (feature.attributes["isLocation"]) {
          showLabel(feature);
        }
        if (feature != self.route.representation) $("body").css({cursor: "pointer"});
      },
      outFeature: function() {
        hideTipsy();
      }
    });

    var panZoom = new OpenLayers.Control.PanZoomBar();
    panZoom.zoomWorldIcon = true;

    var controls = [tooltip, drag, panZoom, new OpenLayers.Control.DragPan(), new OpenLayers.Control.Navigation()];
    this.map.addControls(controls);
    $.each(controls, function (index, item) {
      item.activate();
    });
  },

  getLayer: function(name) {
    return name == "features" ? this.layers.features : this.layers.route;
  },

  removeLocationsFromMap: function() {
    var layer = this.getLayer("features");
    var i, len = layer.features.length, feature, foundFeatures = [];
    for( i = 0; i < len; i++ ) {
      feature = layer.features[i];
      if(feature && feature.attributes){
        if (feature.attributes["isLocation"]) foundFeatures.push(feature);
      }
    }
    layer.destroyFeatures(foundFeatures);
  },

  getFeaturesByAttribute: function(featureLayer, attrName, attrValue) {
    var i, len = featureLayer.features.length, foundFeatures = [], feature;
    for( i = 0; i < len; i++ ) {
      feature = featureLayer.features[i];
      if( feature && feature.attributes ){
         if ( feature.attributes[attrName] === attrValue ) {
            foundFeatures.push(feature);
         }
      }
    }
    return foundFeatures;
  },

  centerOnLocation: function(feature) {
    var center = feature.geometry.bounds.getCenterLonLat();
    feature.layer.map.setCenter(center, 11, true, false);
    feature.layer.redraw();
  },

  addMapIcon: function(api_root, locations) {
    for(var i = 0; i < locations.length; i++) {
      var url = api_root + "/images/icons/" + (i + 1) + ".gif";
      locations[i].attributes["thumbnail"] = url;
    }
    return locations;
  },

  markFeaturesAsLocations: function(items) {
    $.each(items, function(index, item) {
      item.attributes["isLocation"] = true;
      item.fid = index;
    });
  }

});













