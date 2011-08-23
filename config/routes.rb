Geodemo::Application.routes.draw do
  if ["development", "test"].include? Rails.env
    mount Jasminerice::Engine => "/jasmine"
  end
  match '/client/:name' => 'map#show'
  match '/notsupported' => 'map#notsupported'
  resource :map
  resources :locations, :routes
  root :to => "map#show"
end
