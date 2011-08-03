$.Controller("DirectoryController",
{
  init: function(el, options) {
    this.app = options.app;
    this.API_ROOT = options.API_ROOT;
    this.locationList = this.element.find(".list-of-locations");
    this.categoryList = this.element.find(".list-of-categories");
    this.actions = this.element.find(".actions");
    this.infoBox = this.element.find(".info");
    this.locationDetails = this.element.find(".location-details");
    this.mode = "index";
    $.ajax({
      url: this.API_ROOT + "/api/categories?callback=?",
      dataType: 'json',
      success: this.displayCategories,
      context: this
    });
  },

  "reset subscribe": function(){
    this.reset();
  },

  "a:contains('Retour') click": function() {
    if (this.mode == "index") this.reset();
    else this.back();
  },

  "a:contains('Rafraichir') click": function() {
    this.fetchLocations();
  },

  ".list-of-locations a.name click": function(el) {
    var feature = this.app.featureLayer.getFeatureByFid($(el).attr("href").substring(1));
    centerOnLocation(feature);
  },

  ".list-of-locations a.details click": function(el) {
    this.showLocation($(el).attr("href").substring(1));
    this.mode = "details";
  },

  ".list-of-locations a.print click": function(el) {
    var id = $(el).attr("href").substring(1);
    window.open("/locations/" + id, "New Window", "height=500,width=600");
  },

  ".list-of-locations a.name mouseover": function(el) {
    var feature = this.app.featureLayer.getFeatureByFid($(el).attr("href").substring(1));
    showLabel(feature);
  },

  ".list-of-locations a.name mouseout": function() {
    hideTipsy();
  },

  ".list-of-categories a click": function(el) {
    var pos = $(el).text().indexOf("(");
    this.category = {id: $(el).attr("href").substring(1), name: $(el).text().substring(1, pos)};
    this.fetchLocations();
  },

  back: function() {
    this.locationDetails.hide();
    this.categoryList.hide();
    this.actions.show();
    this.locationList.show();
    this.infoBox.show();
    this.mode = "index";
    this.find("a:contains('Rafraichir')").show();
  },

  fetchLocations: function() {
    removeLocationsFromMap(this.app.featureLayer);
    var bounds = this.getBounds();
    $.ajax({
      url: this.API_ROOT + "/api/locations?category=" + this.category.id  + "&bounds=" + bounds + "&callback=?",
      dataType: 'json',
      success: this.showLocations,
      context: this
    });
  },

  reset: function() {
    this.locationList.hide();
    this.infoBox.hide();
    this.actions.hide();
    this.categoryList.show();
    this.locationDetails.hide();
    this.mode = "index";
    this.find("a:contains('Rafraichir')").show();
    removeLocationsFromMap(this.app.featureLayer);
  },

  displayCategories: function(items) {
    for(var i = 0; i < items.length; i++) {
      var className = i % 2 == 1 ? "odd" : "even";
      var item = items[i];
      this.categoryList.append("<li class='"+ className + "'>"
        + "<img src=\"" + this.API_ROOT + "/images/" + item["icon"] + "\" />"
        + "<a href='#" +  item["id"] + "'> " + item["french"] + " (" + item["count"] + ")"
        + "</a></li>");
    }
  },

  showLocation: function(id) {
    $.ajax({
      url: this.API_ROOT + "/api/location?id=" + id + "&callback=?",
      dataType: 'json',
      success: function(data) {
        this.find("a:contains('Rafraichir')").hide();
        this.categoryList.hide();
        this.actions.show();
        this.locationList.hide();
        this.infoBox.hide();
        this.locationDetails.show();
        var attributes = data.properties;
        var top = this.locationDetails.find(".container .top").empty();
        this.addHeader(top, attributes.city_name, attributes.name);

        var left = this.locationDetails.find(".container .left").empty();
        if (attributes.telephone) this.addInfo(left, attributes.telephone, "Telephone");
        if (attributes.email) this.addInfo(left, attributes.email, "Email");
        if (attributes.fax) this.addInfo(left, attributes.fax, "Fax");
        if (attributes.opening_hours) this.addInfo(left, attributes.opening_hours, "Opening Hours");
        if (attributes.website) this.addInfo(left, attributes.website, "Website");
        var boundaries = attributes.boundaries;
        console.debug(boundaries);
        console.debug(boundaries.length);
        var right = this.locationDetails.find(".container .right").empty();
        if (boundaries[0]) this.addInfo(right, boundaries[0].name, boundaries[0].classification);
        if (boundaries[1]) this.addInfo(right, boundaries[1].name, boundaries[1].classification);
        if (boundaries[2]) this.addInfo(right, boundaries[2].name, boundaries[2].classification);
        if (boundaries[3]) this.addInfo(right, boundaries[3].name, boundaries[3].classification);
      },
      context: this
    });
  },

  addInfo: function(box, value, label) {
    box.append("<h2>" + label + "</h2>");
    box.append(value)
  },

  addHeader: function(box, city, name) {
    box.append("<h1>" + name + "</h1>");
    if (city) box.append(city);
  },

  getBounds: function() {
    return this.app.featureLayer.getExtent().toArray();
  },

  showLocations: function(data) {
    this.categoryList.hide();
    this.actions.show();
    this.locationList.show();
    this.infoBox.show();
    var locations = new OpenLayers.Format.GeoJSON().read(data);
    markFeaturesAsLocations(locations);
    this.locationList.html(createList(this.API_ROOT, locations)).show();
    this.app.featureLayer.addFeatures(locations);
    if (locations.length > 98) {
      this.infoBox.html("Plus de 100 POIs dans la cat&eacute;gorie <b>" + this.category.name + "</b> ont &eacute;t&eacute; trouv&eacute; dans l'espace visionn&eacute;. Veuillez choisir un espace plus restreint et relancer la recherche pour voir plus de POIs.");
    } else {
      this.infoBox.html(locations.length + " POIs ont &eacute;t&eacute; trouv&eacute; dans la cat&eacute;gorie <b>" + this.category.name + "</b> dans l'espace visionn&eacute;.");
    }
  }
});