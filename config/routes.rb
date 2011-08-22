Geodemo::Application.routes.draw do
  if ["development", "test"].include? Rails.env
    mount Jasminerice::Engine => "/jasmine"
  end
  match '/client/:name' => 'map#show'
  resource :map
  resources :locations, :routes
  root :to => "map#show"
end
