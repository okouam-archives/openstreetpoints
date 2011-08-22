$.Controller("PanelsController",
{
  init: function(el, options) {
    this.app = options.app;
    var self = this;
    $(el).tabs(
      {
        select: function() {
          options.renderer.removeLocationsFromMap();
          self.publish("reset");
        }
      }
    );
  }
});