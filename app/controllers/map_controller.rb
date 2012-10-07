class MapController < ApplicationController
  layout nil

  def show
    gon.client = params[:name] || "0-One"
    gon.country = params[:country] || "CI"
    gon.api_root = OpenStreetPoints::Application.config.API_ROOT
  end

  def notsupported

  end

end