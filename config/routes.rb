OpenStreetPoints::Application.routes.draw do

  match '/client/:name' => 'map#show'
  match '/notsupported' => 'map#notsupported'
  resource :map, :dashboard
  resources :locations, :routes

  root :to => "map#show"

end
