class CreateUserInfos < ActiveRecord::Migration
  def change
    create_table :user_infos do |t|
      t.string :company
      t.integer :minimum_tenth_percentage
      t.integer :minimum_twelfth_percentage
      t.integer :minimum_cgpa
      t.integer :minimum_current_sgpa
      t.integer :maximum_backlog
      t.string :eligible_courses

      t.timestamps null: false
    end
  end
end
