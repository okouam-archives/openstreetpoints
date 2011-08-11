Geodemo::Application.routes.draw do

  match '/client/:name' => 'map#show'
  resource :map
  resources :locations, :routes
  root :to => "map#show"

end
