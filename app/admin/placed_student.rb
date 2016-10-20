ActiveAdmin.register PlacedStudent do
permit_params :enrollment_number, :name, :institution, :company_1, :company_2, :company_3, :company_4, :company_5, :company_6, :company_7, :company_8
menu :priority => 6
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
