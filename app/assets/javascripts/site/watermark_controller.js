$.Controller("WatermarkController",
{
  init: function(el, text) {
    this.text = text;
    this.element.val(text);
    this.element.addClass("watermark");
  },

  focusin: function() {
    if (this.element.val() == this.text) {
      this.element.removeClass("watermark");
      this.element.val("");
    }
  },

  focusout: function() {
    if ($.trim(this.element.val()) == "") this.showWatermark();
  },

  showWatermark: function() {
    this.element.val(this.text);
    this.element.addClass("watermark");
  }
});