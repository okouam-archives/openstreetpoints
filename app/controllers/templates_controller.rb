class TemplatesController < ApplicationController

  def show
    render params[:id]
  end

end