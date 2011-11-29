class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :name, :limit => 200, :null => false
      t.string :icon, :limit => 200
      t.string :cms_designation, :limit => 200
      t.timestamps
    end
  end
end
