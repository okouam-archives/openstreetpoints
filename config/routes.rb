Geodemo::Application.routes.draw do

  resource :map
  resources :locations, :routes
  root :to => "map#show"

end
