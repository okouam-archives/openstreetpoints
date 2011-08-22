function createSimpleList(locations) {
  return createListFromTemplate(locations, "locations.simple.ejs")
}

function createList(locations) {
  return createListFromTemplate(locations, "locations.ejs")
}

function createListFromTemplate(locations, template) {
  var data = {items: []};
  for(var i = 0; i < locations.length; i++) {
    var attributes =  locations[i].attributes;
    var place = attributes["boundaries"]["0"]["name"];
    if (attributes["city_name"]) place = place + ", " + attributes["city_name"];
    var className = i % 2 == 1 ? "odd" : "even";
    var item = {className: className, place: place, name: attributes["name"], id: attributes["id"], fid: locations[i].fid};
    data.items.push(item);
  }
  return new EJS({url: "/javascripts/templates/" + template}).render(data);
}


