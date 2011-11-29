class Synchronizer

  def update
    settings = Settings.first
    uri = Uri.parse(settings.geocms_api + "?last_refresh=" + settings.last_refresh + "&site=" + settings.site)
    response = Net::HTTP.get_response(uri)
    response.body
  end

end