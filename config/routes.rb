Geodemo::Application.routes.draw do

  match '/client/:name' => 'map#show'
  match '/notsupported' => 'map#notsupported'
  resource :map, :dashboard
  resources :locations, :routes

  devise_for :users, :path_names => { :sign_in => 'login', :sign_out => 'logout'}

  namespace :admin do
    resource :dashboard
    resources :locations, :categories, :users
  end

  root :to => "map#show"

end
