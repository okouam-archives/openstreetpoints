User.destroy_all

User.create([
  {:email => "admin@demo.0-one.net", :password => "changeme"},
  {:email => "john.smith@daemon.co.uk", :password => "changeme"},
  {:email => "ralph23@wellness.com", :password => "changeme"},
  {:email => "emerson.doe@gmail.com", :password => "changeme"},
  {:email => "kitty_32@yahoo.co.uk", :password => "changeme"},
  {:email => "johnny@msn.com", :password => "changeme"},
  {:email => "patrick.helsker@thepiratebay.org", :password => "changeme"},
  {:email => "the.hun@nowhere.com", :password => "changeme"},
])

Category.destroy_all

Category.create([
  {:name => "Accessoires pour la chasse", :cms_designation => "Agence Telecom"},
  {:name => "Bureaux publiques", :cms_designation => "Administration Publique"},
  {:name => "Abattage", :cms_designation => "Agence de voyage"},
  {:name => "Boisson", :cms_designation => "Agence Telecom"},
])

Location.destroy_all

Location.create([
  {:name => "Agence Ivoirienne de Presse", :long_name => "Agence Ivoirienne de Presse",
  :longitude =>  5.3771103670502, :latitude => -3.9923301985169246, :telephone => "", :fax => "", :user_id => User.find_by_email("the.hun@nowhere.com"),
  :email => "", :website => "", :miscellaneous => "", :city_name => "", :postal_address => "", :geographical_address => "",
  :acronym => "AIP"},
  {:name => "ANE", :long_name => "Agence Nationale de l'Environnement", :longitude => "", :latitude => "", :telephone => "", :fax => "",
  :email => "", :website => "", :miscellaneous => "", :city_name => "", :postal_address => "", :geographical_address => "",
  :acronym => "ANE", :category => Category.find_by_name("Abattage")},
  {:name => "ATARE Cote d'Ivoire", :long_name => "", :longitude => "", :latitude => "", :telephone => "", :fax => "",
  :email => "", :website => "", :miscellaneous => "", :city_name => "", :postal_address => "", :geographical_address => "",
  :acronym => "", :category => Category.find_by_name("Bureaux publiques")},
  {:name => "Agence Generale Alcoolique", :long_name => "", :longitude => "", :latitude => "", :telephone => "", :fax => "",
  :email => "AGA", :website => "", :miscellaneous => "", :city_name => "", :postal_address => "", :geographical_address => "",
  :acronym => "", :category => Category.find_by_name("Boisson")},
  {:name => "Bar Zicotek", :long_name => "Bar Zikotek", :longitude => "", :latitude => "", :telephone => "", :fax => "",
  :email => "", :website => "", :miscellaneous => "", :city_name => "", :postal_address => "", :geographical_address => "",
  :acronym => "", :category => Category.find_by_name("Boisson")}
])

#Create some change requests
a = Location.find_by_name("Agence Ivoirienne de Presse")
a.postal_address = "38 Abidjan BP 394"
a.website = "http://www.agence-ivorienne.com"
a.save!

Settings.create(:last_refresh => nil, :geocms_api => "http://geocms.0-one.local/api/partner")
