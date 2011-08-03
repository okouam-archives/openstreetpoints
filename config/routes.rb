Geodemo::Application.routes.draw do

  resource :map
  resources :locations
  root :to => "map#show"

end
