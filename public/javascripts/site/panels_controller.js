$.Controller("PanelsController",
{
  init: function(el, options) {
    this.app = options.app;
    var self = this;
    $(el).tabs(
      {
        select: function() {
          removeLocationsFromMap(self.app.featureLayer);
          self.publish("reset");
        }
      }
    );
  }
});