class CreateDiffs < ActiveRecord::Migration
  def change
    create_table :diffs do |t|
      t.string :old_value
      t.string :new_value
      t.string :key
      t.references :change_request
    end
  end
end
