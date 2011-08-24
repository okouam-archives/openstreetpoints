class MapController < ApplicationController
  layout nil

  def show
    if name = params[:name]
      @client = name
    else
      @client = "0-One"
    end
    if country = params[:country]
      @country = country
    else
      @country = "CI"
    end
  end

  def notsupported

  end

end