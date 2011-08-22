$.Controller("LocalizationController",
{
  init: function(el, options) {
    this.client = options.client;
    this.app = options.app;
    this.API_ROOT = options.API_ROOT;
    this.infoBox = this.element.find(".info");
    this.results = this.element.find("ul");
    this.renderer = options.renderer;
    this.searchBox = this.element.find(":text");
    this.searchBox.watermark("search terms");
    this.results.listing(options);
    this.showPage(1);
    var self = this;
    $(el).find(":submit").click(function() {
      self.search();
    });
  },

  "reset subscribe": function(){
    this.results.hide();
    this.infoBox.hide();
    this.showPage(1);
    this.searchBox.watermark("showWatermark");
  },

  ":text keydown": function(el, e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) {
      this.search();
    }
  },

  ".page2 a.previous click": function() {
    this.showPage(1);
  },

  "ul show": function(el, ev, data) {
    this.showLocation(data);
  },

  search: function() {
    var query = this.searchBox.val(), bounds = this.getBounds(), self = this;
    $.getJSON(this.API_ROOT + "/api/features?callback=?&q=" + query + "&client=" + client + "&bounds=" + bounds,
      function(data) {
        self.showLocations(data);
      }
    );
  },

  showLocation: function(data) {
    this.showPage(2);
    this.find(".page2").html(new EJS({url: "/javascripts/templates/info.ejs"}).render(data.properties));
  },

  showPage: function(num) {
    this.element.find(".page1").hide();
    this.element.find(".page2").hide();
    this.element.find(".page" + num).show();
  },

  getBounds: function() {
    return this.renderer.getLayer("features").getExtent().toArray();
  },

  showLocations: function(data) {
    this.renderer.removeLocationsFromMap();
    var locations = this.renderer.addMapIcon(this.API_ROOT, new OpenLayers.Format.GeoJSON().read(data));
    var numLocations = locations.length;
    if (numLocations > 0) {
      this.renderer.markFeaturesAsLocations(locations);
      this.results.html(createList(locations)).show();
      this.renderer.getLayer("features").addFeatures(locations);
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