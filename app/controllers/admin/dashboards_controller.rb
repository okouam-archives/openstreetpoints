class Admin::DashboardsController < ApplicationController

  def synchronize
    @response = Synchronizer.new.update
  end

end