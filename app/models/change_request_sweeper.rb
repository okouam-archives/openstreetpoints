class ChangeRequestSweeper < ActionController::Caching::Sweeper
  observe ChangeRequest

  def before_create(change_request)
    change_request.user ||= current_user
  end

  def current_user
    controller.send :current_user if controller && controller.respond_to?(:current_user, true)
  end

end