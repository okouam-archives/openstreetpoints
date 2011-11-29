class CreateChangeRequests< ActiveRecord::Migration
  def change
    create_table :change_requests do |t|
      t.references :location
      t.timestamps
    end
  end
end
