class CreatePlacedStudents < ActiveRecord::Migration
  def change
    create_table :placed_students do |t|
    		t.string :enrollment_number
		t.string :name
		t.string :institution
		t.string :company_1
		t.string :company_2
		t.string :company_3
		t.string :company_4
		t.string :company_5
		t.string :company_6
		t.string :company_7
		t.string :company_8


      t.timestamps null: false
    end
  end
end
