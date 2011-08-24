$.Class.extend("Navigator", {

  init: function(renderer, API_ROOT, country) {
    this.renderer = renderer;
    this.API_ROOT = API_ROOT;
    this.country = country;
  },

  hasEndpoints: function() {
    return this.arrivalPoint && this.departurePoint;
  },

  createDirectionsRequest: function(departure, arrival) {
    var start = this.departurePoint.geometry;
    var end = this.arrivalPoint.geometry;
    return "x1=" + start.x + "&y1=" + start.y + "&departure=" + departure + "&arrival=" + arrival + "&x2=" + end.x + "&y2=" + end.y;
  },

  reset: function() {
    if (this.departurePoint) this.departurePoint.destroy();
    if (this.arrivalPoint) this.arrivalPoint.destroy();
    this.renderer.getLayer("route").destroyFeatures();
  },

  removeDeparturePoint: function() {
    if (this.departurePoint) {
      this.renderer.getLayer("features").destroyFeatures([this.departurePoint]);
      this.departurePoint.destroy();
      this.departurePoint = null;
    }
  },

  removeArrivalPoint: function() {
    if (this.arrivalPoint) {
      this.renderer.getLayer("features").destroyFeatures([this.arrivalPoint]);
      this.arrivalPoint.destroy();
      this.arrivalPoint = null;
    }
  },

  selectDeparture: function(featureId, onRouteFound) {
    this.removeDeparturePoint();
    this.createDeparturePoint(featureId);
    this.findRoute(onRouteFound)
  },

  selectArrival: function(featureId, onRouteFound) {
    this.removeArrivalPoint();
    this.createArrivalPoint(featureId);
    this.findRoute(onRouteFound)
  },

  createDeparturePoint: function(featureId) {
    var feature = this.renderer.getLayer("features").getFeatureByFid(featureId);
    this.departurePoint = this.createMarker(feature.geometry, "/assets/images/start.png");
    this.renderer.getLayer("features").addFeatures([this.departurePoint]);
    this.renderer.removeLocationsFromMap();
  },

  createArrivalPoint: function(featureId) {
    var feature = this.renderer.getLayer("features").getFeatureByFid(featureId);
    this.arrivalPoint = this.createMarker(feature.geometry, "/assets/images/end.png");
    this.renderer.getLayer("features").addFeatures([this.arrivalPoint]);
    this.renderer.removeLocationsFromMap();
  },

  findRoute: function(onRouteFound) {
    if (this.arrivalPoint && this.departurePoint) {
      if (this.route) this.renderer.getLayer("route").destroyFeatures(this.route);
      var request = this.createDirectionsRequest("", "");
      $.ajax({
        url: this.API_ROOT + "/api/route?callback=?&" + request,
        dataType: 'json',
        success: function(data) {
          this.route = new Route(data.route);
          this.renderer.removeLocationsFromMap();
          var layer = this.renderer.getLayer("route");
          layer.destroyFeatures();
          layer.addFeatures(this.route.linestrings);
          this.renderer.map.zoomToExtent(layer.getDataExtent());
          onRouteFound(this.route.getDirections());
        },
        context: this
      });
    }
  },

  searchLocations: function(onLocationsFound,query) {
    var self = this;
    $.getJSON(this.API_ROOT + "/api/features?callback=?&q=" + query + "&country=" + this.country,
      function(data) {
        self.renderer.removeLocationsFromMap();
        var locations = self.renderer.addMapIcon(self.API_ROOT, new OpenLayers.Format.GeoJSON().read(data));
        if (locations.length > 0) {
          $.each(locations, function(index, item) {
            item.attributes["isLocation"] = true;
            item.fid = index;
          });
          self.renderer.getLayer("features").addFeatures(locations);
        }
        onLocationsFound(locations);
      }
    );
  },

  createMarker: function(geometry, img) {
    var marker = new OpenLayers.Feature.Vector(geometry.clone());
    marker.attributes["thumbnail"] = img;
    marker.attributes["isRouteMarker"] = true;
    return marker;
  }

});