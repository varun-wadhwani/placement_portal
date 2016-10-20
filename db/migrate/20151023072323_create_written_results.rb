class CreateWrittenResults < ActiveRecord::Migration
  def change
    create_table :written_results do |t|
    		t.string :enrollment_number
    		t.string :name
    		t.string :institution

      t.timestamps null: false
    end
  end
end
