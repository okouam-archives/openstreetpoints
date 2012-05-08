$.Controller "PanelsController",

  init: (el, options) ->
    @app = options.app
    $(el).tabs
        select: () =>
          options.renderer.removeLocationsFromMap()
          @publish("reset")
