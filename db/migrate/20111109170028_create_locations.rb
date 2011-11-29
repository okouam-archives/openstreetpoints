class CreateLocations < ActiveRecord::Migration

  def change
    create_table :locations, :force => true do |t|
      t.string :name
      t.decimal :longitude
      t.decimal :latitude
      t.string :city_name
      t.string :long_name
      t.string :level_0
      t.string :level_1
      t.string :level_2
      t.string :level_3
      t.string :level_4
      t.string :email
      t.string :fax
      t.references :user
      t.string :telephone
      t.string :source
      t.string :website
      t.string :postal_address
      t.string :opening_hours
      t.string :acronym
      t.string :geographical_address
      t.references :category
      t.text :miscellaneous
      t.timestamps
    end
    add_column :locations, :fid, :uuid
    add_index :locations, ["name"], :name => "idx_locations_name"
  end
end
