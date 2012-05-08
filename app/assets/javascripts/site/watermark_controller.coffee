$.Controller "WatermarkController",

  init: (el, text) ->
    @text = text
    @element.val(text)
    @element.addClass("watermark")

  focusin: () ->
    if @element.val() == @text
      @element.removeClass("watermark")
      @element.val("")

  focusout: () ->
    @showWatermark() if $.trim(@element.val()) == ""

  showWatermark: () ->
    @element.val(@text);
    @element.addClass("watermark");
