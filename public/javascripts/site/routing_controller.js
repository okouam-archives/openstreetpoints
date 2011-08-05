$.Controller("RoutingController",
{
  init: function(el, options) {
    this.app = options.app;
    this.API_ROOT = options.API_ROOT;
    var self = this;
    this.element.find(".departures a").live('click', function() {
      self.selectDeparture(this);
    });
    this.element.find(".arrivals a").live('click', function() {
      self.selectArrival(this);
    });
  },

  "reset subscribe": function(){
    this.reset();
  },

  ".departure :text focus": function(el) {
    this.handleWatermarkFocus($(el));
  },

  ".arrival :text focus": function(el) {
    this.handleWatermarkFocus($(el));
  },

  ".departure :text blur": function(el) {
    this.handleWatermarkBlur($(el), "departure");
  },

  ".arrival :text blur": function(el) {
    this.handleWatermarkBlur($(el), "arrival");
  },

  "a:contains('Recommencer') click": function() {
    this.reset();
  },

  ".departure :submit click": function() {
    this.element.find(".arrivals").empty().hide();
    this.handleSearch(this.element.find(".departure"), this.element.find(".departures"));
  },

  ".departure :text keydown": function(el, e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) {
      this.element.find(".arrivals").empty().hide();
      this.handleSearch(this.element.find(".departure"), this.element.find(".departures"));
    }
  },

  ".arrival :submit click": function() {
    this.element.find(".departures").empty().hide();
    this.handleSearch(this.element.find(".arrival"), this.element.find(".arrivals"));
  },

  ".arrival :text keydown": function(el, e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) {
      this.element.find(".departures").empty().hide();
      this.handleSearch(this.element.find(".arrival"), this.element.find(".arrivals"));
    }
  },

  reset: function() {
    if (this.departurePoint) this.departurePoint.destroy();
    if (this.arrivalPoint) this.arrivalPoint.destroy();
    this.app.routeLayer.destroyFeatures();
    this.element.find("ul.directions").hide();
    this.element.find(".departures").empty().hide();
    this.element.find(".arrivals").empty().hide();
    this.showWatermark($(".departure :text"), "departure");
    this.showWatermark($(".arrival :text"), "arrival");
  },

  handleWatermarkFocus: function(textbox) {
    if (textbox.val() == "departure" || textbox.val() == "arrival") {
      textbox.removeClass("watermark");
      textbox.val("");
    }  
  },

  handleWatermarkBlur: function(textbox, watermarkText) {
    if ($.trim(textbox.val()) == "") {
      this.showWatermark(textbox, watermarkText);
    }
  },

  showWatermark: function(textbox, watermarkText) {
    textbox.val(watermarkText);
    textbox.addClass("watermark");
  },

  selectDeparture: function(el) {
    $(".departure :text").val($(el).text());
    var feature = this.app.featureLayer.getFeatureByFid($(el).attr("href").substring(1));
    if (this.departurePoint != null) {
      this.app.featureLayer.destroyFeatures([this.departurePoint]);
      this.departurePoint.destroy();
      this.departurePoint = null;
    }
    this.departurePoint = this.createMarker(feature.geometry, this.app.map, "/images/start.png");
    this.app.featureLayer.addFeatures([this.departurePoint]);
    removeLocationsFromMap(this.app.featureLayer);
    this.element.find(".departures").empty().hide();
    this.route();
  },

  selectArrival: function(el) {
    $(".arrival :text").val($(el).text());
    var feature = this.app.featureLayer.getFeatureByFid($(el).attr("href").substring(1));
    if (this.arrivalPoint != null) {
      this.app.featureLayer.destroyFeatures([this.arrivalPoint]);
      this.arrivalPoint.destroy();
      this.arrivalPoint = null;
    }
    this.arrivalPoint = this.createMarker(feature.geometry, this.app.map, "/images/end.png");
    this.app.featureLayer.addFeatures([this.arrivalPoint]);
    removeLocationsFromMap(this.app.featureLayer);
    this.element.find(".arrivals").empty().hide();
    this.route();
  },

  route: function() {
    if (this.arrivalPoint && this.departurePoint) {
      var start = this.departurePoint.geometry, end = this.arrivalPoint.geometry;
      if (this.route) this.app.routeLayer.destroyFeatures(this.route);
      if (console && console.debug) this.printDebugInfo(start, end);
      var request = "x1=" + start.x + "&y1=" + start.y + "&x2=" + end.x + "&y2=" + end.y;
      $.ajax({
        url: this.API_ROOT + "/api/route?callback=?&" + request,
        dataType: 'json',
        success: this.drawRoute,
        context: this
      });
    }
  },

  printDebugInfo: function(source, target) {
      console.debug("x1: " + source.x);
      console.debug("y1: " + source.y);
      console.debug("x2: " + target.x);
      console.debug("y2: " + target.y);
  },

  handleSearch: function(wrapper, list) {
    var query = wrapper.find(":text").val(), self = this;
    $.getJSON(this.API_ROOT + "/api/features?callback=?&q=" + query,
      function(data) {
        self.showLocations(data, self.app.featureLayer, list, 100);
      }
    );
  },

  showLocations: function(data, layer, container) {
    removeLocationsFromMap(layer);
    container.empty();
    var locations = addMapIcon(this.API_ROOT, new OpenLayers.Format.GeoJSON().read(data));
    if (locations.length > 0) {
      $.each(locations, function(index, item) {
        item.attributes["isLocation"] = true;
        item.fid = index;
      });
      container.html(createSimpleList(locations));
      layer.addFeatures(locations);
      container.show();
    }
  },

  createMarker: function(geometry, map, img) {
    var marker = new OpenLayers.Feature.Vector(geometry.clone());
    marker.attributes["thumbnail"] = img;
    marker.attributes["isRouteMarker"] = true;
    return marker;
  },

  drawRoute: function(data) {
    var geojson_format = new OpenLayers.Format.GeoJSON();
    var route = geojson_format.read(data.route);
    var description = generateRouteDescription(route);

    var list = "<li class='route-endpoint'><img src=\"/images/start.png\"/><span>" + $(".departure :text").val() + "</span></li>";
    $.each(description, function(index, item) {
      var className = index % 2 == 0 ? "odd" : "even";
      var image = "<img src=\"/images/" + item[0] + "\" />";
      list += "<li class='" + className + "'>" + image + "<span>" + item[1] + "</span></li>";
    });
    list += "<li class='route-endpoint'><img src=\"/images/end.png\"/><span>" + $(".arrival :text").val() + "</span></li>";

    this.element.find("ul.directions").html(list).show();
    removeLocationsFromMap(this.app.featureLayer);
    this.app.routeLayer.destroyFeatures();
    this.app.routeLayer.addFeatures(route);
    this.app.map.zoomToExtent(this.app.routeLayer.getDataExtent());
    this.app.route = route;
  }
});