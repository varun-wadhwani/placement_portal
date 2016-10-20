class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :enrollment_number
      t.string :email
      t.string :phone_number
      t.string :date_of_birth
      t.string :percentage_class_tenth
      t.string :percentage_class_twelfth
      t.string :cgpa
      t.string :current_sgpa
      t.string :current_log
      t.string :degree

      t.timestamps null: false
    end
  end
end
