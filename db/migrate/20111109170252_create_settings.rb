class CreateSettings < ActiveRecord::Migration
  def change
    create_table :settings do |t|
      t.string :geocms_api
      t.timestamp :last_refresh
    end
  end
end
