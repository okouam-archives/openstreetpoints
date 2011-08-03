require 'open-uri'

class LocationsController < ApplicationController

  def show
    id = params[:id]
    @result = ActiveSupport::JSON.decode(open("http://geocms.0-one.local/api/location?id=" + id).readline)
  end

end