class MapController < ApplicationController
  layout nil

  def show
    if name = params[:name]
      @client = name
    else
      @client = "0-One"
    end
  end

end