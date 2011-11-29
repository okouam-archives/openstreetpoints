# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20111110031445) do

  create_table "categories", :force => true do |t|
    t.string   "name",            :limit => 200, :null => false
    t.string   "icon",            :limit => 200
    t.string   "cms_designation", :limit => 200
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "change_requests", :force => true do |t|
    t.integer  "location_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "diffs", :force => true do |t|
    t.string  "old_value"
    t.string  "new_value"
    t.string  "key"
    t.integer "change_request_id"
  end

  create_table "geometry_columns", :id => false, :force => true do |t|
    t.string  "f_table_catalog",   :limit => 256, :null => false
    t.string  "f_table_schema",    :limit => 256, :null => false
    t.string  "f_table_name",      :limit => 256, :null => false
    t.string  "f_geometry_column", :limit => 256, :null => false
    t.integer "coord_dimension",                  :null => false
    t.integer "srid",                             :null => false
    t.string  "type",              :limit => 30,  :null => false
  end

  create_table "locations", :force => true do |t|
    t.string   "name"
    t.decimal  "longitude"
    t.decimal  "latitude"
    t.string   "city_name"
    t.string   "long_name"
    t.string   "level_0"
    t.string   "level_1"
    t.string   "level_2"
    t.string   "level_3"
    t.string   "level_4"
    t.string   "email"
    t.string   "fax"
    t.integer  "user_id"
    t.string   "telephone"
    t.string   "source"
    t.string   "website"
    t.string   "postal_address"
    t.string   "opening_hours"
    t.string   "acronym"
    t.string   "geographical_address"
    t.integer  "category_id"
    t.text     "miscellaneous"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "fid",                  :limit => nil
  end

  add_index "locations", ["name"], :name => "idx_locations_name"

  create_table "settings", :force => true do |t|
    t.string   "geocms_api"
    t.datetime "last_refresh"
  end

  create_table "spatial_ref_sys", :id => false, :force => true do |t|
    t.integer "srid",                      :null => false
    t.string  "auth_name", :limit => 256
    t.integer "auth_srid"
    t.string  "srtext",    :limit => 2048
    t.string  "proj4text", :limit => 2048
  end

  create_table "users", :force => true do |t|
    t.string   "email",                                 :default => "", :null => false
    t.string   "encrypted_password",     :limit => 128, :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                         :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
