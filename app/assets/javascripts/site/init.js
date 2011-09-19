function init() {

  var localSettings = {
    localization : {
      message: "Votre recherche a identifi&eacute; plus de 100 POIs dans l'espace visionn&eacute;. Veuillez choisir un espace plus restreint et relancer la recherche pour voir plus de POIs."
    },
    categories: {
      message: "La cat&eacute;gorie choisie contient plus de 100 POIs dans l'espace visionn&eacute;. Veuillez choisir un espace plus restreint et relancer la recherche pour voir plus de POIs."    }
  };

  var renderer = new Renderer("map", window.API_ROOT);

  window.app = {
    settings: localSettings, route: {}
  };

  var options = {
    app: window.app,
    API_ROOT: window.API_ROOT,
    renderer: renderer,
    client: window.client,
    country: window.country
  };

  $("#tabs").panels(options);
  $("#localization").localization(options);
  $("#routing").routing(options);
  $("#categories").directory(options);

}