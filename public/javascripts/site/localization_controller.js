$.Controller("LocalizationController",
{
  init: function(el, options) {
    this.app = options.app;
    this.API_ROOT = options.API_ROOT;
    this.infoBox = this.element.find(".info");
    this.results = this.element.find("ul");
    this.searchBox = this.element.find(":text");
    this.searchBox.watermark("search terms");
    var self = this;
    $(el).find(":submit").click(function() {
      self.search();
    });
  },

  "reset subscribe": function(){
    this.results.hide();
    this.infoBox.hide();
    this.searchBox.watermark("show");
  },

  ":text keydown": function(el, e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) {
      this.search();
    }
  },

  "ul a click": function(el) {
    var feature = this.app.featureLayer.getFeatureByFid($(el).attr("href").substring(1));
    centerOnLocation(feature);
  },

  "ul a mouseover": function(el) {
    var feature = this.app.featureLayer.getFeatureByFid($(el).attr("href").substring(1));
    showLabel(feature);
  },

  "ul a mouseout": function() {
    hideTipsy();
  },

  search: function() {
    var query = this.searchBox.val(), bounds = this.getBounds(), self = this;
    $.getJSON(this.API_ROOT + "/api/features?callback=?&q=" + query + "&bounds=" + bounds,
      function(data) {
        self.showLocations(data);
        bindSearchResults(self.element, self.app.featureLayer);
      }
    );
  },

  getBounds: function() {
    return this.app.featureLayer.getExtent().toArray();
  },

  showLocations: function(data) {
    removeLocationsFromMap(this.app.featureLayer);
    var locations = new OpenLayers.Format.GeoJSON().read(data);
    var numLocations = locations.length;
    if (numLocations > 0) {
      markFeaturesAsLocations(locations);
      this.results.html(createList(this.API_ROOT, locations)).show();
      this.app.featureLayer.addFeatures(locations);
      if (numLocations == 99) {
        this.infoBox.html("Votre recherche a identifi&eacute; plus de 100 POIs dans l'espace visionn&eacute;. Veuillez choisir un espace plus restreint et relancer la recherche pour voir plus de POIs.").show();
      } else {
        this.infoBox.html(numLocations + " POIs ont &eacute;t&eacute; trouv&eacute;s.")
      }
    } else {
      this.results.hide();
      this.infoBox.html("Aucun POI a &eacute;t&eacute; trouv&eacute;.").show();
    }
  }
});