$.Controller("RoutingController",
{
  init: function(el, options) {
    this.navigator = new Navigator(options.renderer, options.API_ROOT);
    var self = this;
    this.element.find(".departure :text").watermark("departure");
    this.element.find(".arrival :text").watermark("arrival");
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
    this.navigator.reset();
    this.element.find("ul.directions").hide();
    this.element.find(".departures").empty().hide();
    this.element.find(".arrivals").empty().hide();
    this.element.find(".arrival :text").watermark("showWatermark");
    this.element.find(".departure :text").watermark("showWatermark");
  },

  selectDeparture: function(el) {
    $(".departure :text").val($(el).text());
    var featureId = $(el).attr("href").substring(1);
    this.element.find(".departures").empty().hide();
    this.navigator.selectDeparture(featureId, this.showDirections);
  },

  selectArrival: function(el) {
    $(".arrival :text").val($(el).text());
    var featureId = $(el).attr("href").substring(1);
    this.element.find(".arrivals").empty().hide();
    var self = this;
    this.navigator.selectArrival(featureId, function(directions) {
      self.showDirections(directions);
    });
  },

  ".print click": function() {
    if (this.navigator.hasEndpoints()) {
      var departure = $(".departure :text").val();
      var arrival = $(".arrival :text").val();
      window.open("/routes?" + this.navigator.createDirectionsRequest(departure, arrival), "_blank", "height=500,width=600");
    }
  },

  handleSearch: function(wrapper, container) {
    var query = wrapper.find(":text").val();
    var self = this;
    this.navigator.searchLocations(function(locations) {
      self.showLocations(locations, container)
    }, query);
  },

  showLocations: function(locations, container) {
    container.empty();
    if (locations.length > 0) {
      container.html(createSimpleList(locations));
      container.show();
    }
  },

  showDirections: function(directions) {
    this.element.find("ul.directions").html(directions).show();
    this.element.find(".print").show();
  }
});