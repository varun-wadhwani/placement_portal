Rails.application.routes.draw do



  get    'login'   => 'sessions#new'
  post   'login'   => 'sessions#create'
  get 'logout'  => 'sessions#destroy'
   get    'signup'  => 'users#new'
  devise_for :admin_users, ActiveAdmin::Devise.config
   get 'admin/logout' => 'sessions#destroy'
   

  ActiveAdmin.routes(self)
  root to: 'users#index'


  
 
  resources :users
  resources :about
  resources :procedure
  resources :why_recruit
  resources :alumni
  resources :interview_results
  resources :our_recruiters
  resources :placement_policy
  resources :preparation_portal
  resources :rnd
  resources :selection_process
  resources :written_results
  resources :contact_us
  resources :our_recruiters
  resources :final_results
  resources :user_info
  resources :placed_students
  resources :register_confirm
end
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end