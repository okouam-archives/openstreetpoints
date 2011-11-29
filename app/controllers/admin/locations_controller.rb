class Admin::LocationsController < ApplicationController

  def show

  end

  def edit
    @location = Location.find(params[:id])
  end

  def index
    @locations = Location.all
  end

end