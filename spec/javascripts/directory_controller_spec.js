//= require libraries/jquery-1.6.2.min
//= require libraries/jquery-ui-1.8rc3.custom.min
//= require libraries/OpenLayers
//= require libraries/jquerymx-1.0.custom.min
//= require libraries/ejs_production

//= require site/common
//= require site/helpers/navigation
//= require site/helpers/tipsy
//= require site/map
//= require site/listing_controller
//= require site/watermark_controller
//= require site/directory_controller
//= require site/localization_controller
//= require site/routing_controller
//= require site/panels_controller

describe("DirectoryController", function() {

  beforeEach(function() {
    loadFixtures("directory_controller.html");
    var options = {API_ROOT: "X"};
    $("#jasmine-fixtures").directory(options);
  });

  describe("when initialized", function() {

    it("fetches the list of available categories", function() {
      return false;
    });

    it("shows the first page", function() {
      return false;
    });
  });
});