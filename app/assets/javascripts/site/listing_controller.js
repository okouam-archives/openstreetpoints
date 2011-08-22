$.Controller("ListingController",
{
  init: function(el, options) {
    this.app = options.app;
    this.renderer = options.renderer;
    this.API_ROOT = options.API_ROOT
  },

  "a.name click": function(el) {
    var feature = this.renderer.getLayer("features").getFeatureByFid($(el).attr("href").substring(1));
    this.renderer.centerOnLocation(feature);
  },

  "a.details click": function(el) {
    var id = $(el).attr("href").substring(1);
    $.ajax({
      url: this.API_ROOT + "/api/location?id=" + id + "&callback=?",
      dataType: 'json',
      success: function(data) {
        this.element.trigger('show', data);
      },
      context: this
    });
  },

  "a.print click": function(el) {
    var id = $(el).attr("href").substring(1);
    this.showPrintableDetails(id);
  },

  "a.name mouseover": function(el) {
    var fid = $(el).attr("href").substring(1);
    this.showLocationName(fid);
  },

  "a.name mouseout": function() {
    hideTipsy();
  },

  showLocationName: function(fid) {
    var feature = this.renderer.getLayer("features").getFeatureByFid(fid);
    showLabel(feature);
  },

  showPrintableDetails: function(id) {
    window.open("/locations/" + id, "New Window", "height=500,width=600");
  }

});