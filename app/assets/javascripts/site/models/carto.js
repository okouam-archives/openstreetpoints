$.Class.extend('Carto',
{
  displayLandmarkFeatures: function(features, bbox, layer, api_url) {
      var visibleLocations = $.map(features, function(value) {
        if (value.onScreen()) return value.attributes.id;
        else return null;
      });
      visibleLocations = $.grep(visibleLocations, function(value) {
        return value != null;
      });
    $.getJSON(api_url + "/api/landmarks?visible=" + visibleLocations + "&callback=?&bbox=" + bbox,
      function(data) {
        var locations = new OpenLayers.Format.GeoJSON().read(data);
        $.each(locations, function(index, value) {
          value.attributes["isLocation"] = true;
          value.attributes["thumbnail"] = api_url + value.attributes["icon"].url
        });
        layer.addFeatures(locations);
      }
    );
  },

  createLayer: function(name, map) {
    var layer = new OpenLayers.Layer.Vector(name);
    var style = new OpenLayers.Style({externalGraphic: '${thumbnail}', 'pointRadius': 9});
    var style_map = new OpenLayers.StyleMap({'default': style, 'select': style});
    layer.styleMap = style_map;
    map.addLayer(layer);
    return layer;
  }
},
{
  // no instance methods
});