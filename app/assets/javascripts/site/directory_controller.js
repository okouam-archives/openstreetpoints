$.Controller("DirectoryController",
{
  init: function(el, options) {
    this.client = options.client;
    this.renderer = options.renderer;
    this.API_ROOT = options.API_ROOT;
    this.country = options.country;
    this.categoryList = this.element.find(".categories");
    this.locationList = this.element.find(".locations");
    this.infoBox = this.element.find(".info");
    this.locationDetails = this.element.find(".location-details");
    this.mode = "index";
    this.locationList.listing(options);
    this.showPage(1);
    $.ajax({
      url: this.API_ROOT + "/api/categories?callback=?&client=" + this.client + "&country=Côte d'Ivoire",
      dataType: 'json',
      success: this.showCategories,
      context: this
    });
  },

  "reset subscribe": function(){
    this.reset();
  },

  ".page2 a.previous click": function() {
    this.reset();
  },

  ".page3 a.previous click": function() {
    this.showPage(2);
  },

  ".page2 a.refresh  click": function() {
    this.fetchLocations();
  },

  ".categories a click": function(el) {
    var pos = $(el).text().indexOf("(");
    this.category = {id: $(el).attr("href").substring(1), name: $(el).text().substring(1, pos)};
    this.fetchLocations();
  },

  ".locations show": function(el, ev, data) {
    this.showLocation(data);
  },

  fetchLocations: function() {
    this.renderer.removeLocationsFromMap();
    var bounds = this.getBounds();
    $.ajax({
      url: this.API_ROOT + "/api/locations?classification=" + this.category.id  + "&bounds=" + bounds + "&callback=?&client=" + this.client + "&country=" + this.country,
      dataType: 'json',
      success: this.showLocations,
      context: this
    });
  },

  reset: function() {
    this.showPage(1);
    this.renderer.removeLocationsFromMap();
  },

  showCategories: function(items) {
    var template = $.template("categories.ejs",
      "<li class='${className}'> \
        <img src='${site}/system/icons/${location.icon}' alt='icon' /> \
        <a href='#${location.id}'>${location.french} (${location.count})</a> \
      </li>"
    );
    var data = [];
    for(var i = 0; i < items.length; i++) {
      var className = i % 2 == 1 ? "odd" : "even";
      $.extend(items[i], {className: className, site: this.API_ROOT});
      data.push(items[i]);
    }
    this.categoryList.append($.tmpl(template, data));
  },

  showLocations: function(data) {
    this.showPage(2);
    var locations = this.renderer.addMapIcon(this.API_ROOT, new OpenLayers.Format.GeoJSON().read(data));
    this.renderer.markFeaturesAsLocations(locations);
    this.locationList.html(createList(locations)).show();
    this.renderer.getLayer("features").addFeatures(locations);
    if (locations.length > 98) {
      this.infoBox.html("Plus de 100 POIs dans la cat&eacute;gorie <b>" + this.category.name + "</b> ont &eacute;t&eacute; trouv&eacute; dans l'espace visionn&eacute;. Veuillez choisir un espace plus restreint et relancer la recherche pour voir plus de POIs.");
    } else {
      this.infoBox.html(locations.length + " POIs ont &eacute;t&eacute; trouv&eacute; dans la cat&eacute;gorie <b>" + this.category.name + "</b> dans l'espace visionn&eacute;.");
    }
  },

  showLocation: function(data) {
    this.showPage(3);
    this.find(".page3").html(showInfo(data.properties));
  },

  showPage: function(num) {
    this.element.find(".page1").hide();
    this.element.find(".page2").hide();
    this.element.find(".page3").hide();
    this.element.find(".page" + num).show();
  },

  getBounds: function() {
    return this.renderer.getLayer("features").getExtent().toArray();
  }

});