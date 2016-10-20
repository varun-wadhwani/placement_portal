ActiveAdmin.register UserInfo do
permit_params :company, :minimum_tenth_percentage, 
:minimum_twelfth_percentage, :minimum_cgpa, :company_2, :minimum_current_sgpa, :maximum_backlog, 
:eligible_courses
menu :priority => 4
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
# permit_params :list, :of, :attributes, :on, :model
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if resource.something?
#   permitted
# end


end
