ActiveAdmin.register_page "Dashboard" do

  menu priority: 1, label: proc{ I18n.t("active_admin.dashboard") }

  content title: proc{ I18n.t("active_admin.dashboard") } do
    

    # Here is an example of a simple dashboard with columns and panels.
    #
    columns do
    #   column do
    #     panel "Recent Posts" do
    #       ul do
    #         Post.recent(5).map do |post|
    #           li link_to(post.title, admin_post_path(post))
    #         end
    #       end
    #     end
    #   end

       column do
         panel "Info" do
           para "Welcome to Admin Panel.Admin have all the rights to view, update, delete the information. "
         end
       end

       column do
         panel "Users" do
           para "Shows complete information about registered students."
         end
       end

        column do
         panel "Admin Users" do
           para "Shows complete information about registered Admins.One admin can make other admins too."
         end
       end
 end
     columns do
       

         column do
         panel "User Infos" do
           para "Shows placement criteria of different companies."
         end
       end

        column do
         panel "Result" do
           para "Shows written, interview and final results of companies."
         end
       end

        column do
         panel "Placed Students" do
           para "Shows complete information about placed students."
         end
       end
    end
  end # content
end
