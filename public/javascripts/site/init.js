$(document).ready(function() {

  var localSettings = {
    localization : {
      message: "Votre recherche a identifi&eacute; plus de 100 POIs dans l'espace visionn&eacute;. Veuillez choisir un espace plus restreint et relancer la recherche pour voir plus de POIs."
    },
    categories: {
      message: "La cat&eacute;gorie choisie contient plus de 100 POIs dans l'espace visionn&eacute;. Veuillez choisir un espace plus restreint et relancer la recherche pour voir plus de POIs."    }
  };

  window.app = {settings: localSettings, route: {}};
  window.app.map = setupMap("map");
  window.app.map.zoomTo(0);
  window.app.routeLayer = setupRouteLayer(window.app.map);
  window.app.featureLayer = setupFeaturesLayer(window.app.map);
  setupMapControls(window.app, window.app.featureLayer);

  var api_root = "http://geocms.0-one.net";

  if (window.site && window.site == "demo.0-one.local") {
      api_root = "http://geocms.0-one.local";
  }

  var options = {app: window.app, API_ROOT: api_root};
  $("#tabs").panels(options);
  $("#localization").localization(options);
  $("#routing").routing(options);
  $("#categories").directory(options);
});