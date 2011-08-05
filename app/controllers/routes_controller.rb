class RoutesController < ApplicationController
  layout nil

  def index
    @x1, @x2, @y1, @y2 = params[:x1], params[:x2], params[:y1], params[:y2]
    @departure, @arrival = params[:departure], params[:arrival]
  end

end