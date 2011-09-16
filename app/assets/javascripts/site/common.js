function createSimpleList(locations) {
  return createListFromTemplate(locations, "locations.simple.ejs")
}

function createList(locations) {
  return createListFromTemplate(locations, "locations.ejs")
}

function showInfo(attributes) {
  $.template("info.ejs",
  "<div class='location-details'> \
    <div class='container'> \
      <img src='/assets/images/highrise.png' /> \
      <div class='top'> \
        <h1>${name}</h1> \
        {{if city_name}} ${city_name} {{/if}} \
      </div> \
      <div class='clear'></div> \
      <div class='left'> \
        {{if telephone}} <h2>Telephone</h2> ${telephone} {{/if}} \
        {{if email}} <h2>Email</h2> ${email} {{/if}} \
        {{if fax}} <h2>Fax</h2> ${fax} {{/if}} \
        {{if opening_hours}} <h2>Opening Hours</h2> ${opening_hours} {{/if}} \
        {{if website}} <h2>Website</h2> ${website} {{/if}} \
        {{if acronym}} <h2>Acronym</h2> ${acronym} {{/if}} \
        {{if geographical_address}} <h2>Geographical Address</h2> ${geographical_address} {{/if}} \
      </div> \
      <div class='right'> \
        {{if boundaries[0]}} <h2>${boundaries[0].classification}</h2>${boundaries[0].name} {{/if}} \
        {{if boundaries[1]}} <h2>${boundaries[1].classification}</h2>${boundaries[1].name} {{/if}} \
        {{if boundaries[2]}} <h2>${boundaries[2].classification}</h2>${boundaries[2].name} {{/if}} \
        {{if boundaries[3]}} <h2>${boundaries[3].classification}</h2>${boundaries[3].name} {{/if}} \
      </div> \
    </div> \
   </div> \
   <div class='actions'> \
    <a href='#' class='previous'>Retour</a> \
   </div>");
   return $.tmpl("info.ejs", attributes);
}

function createListFromTemplate(locations, view) {

  $.template("locations.ejs",
    "<li class='${className}'> \
      <div class='numbering' style='display: inline-block; float: left; width : 35px; text-align: right; padding-right: 10px; height:40px'>\
        <span>${number}</span> \
      </div> \
      <a href='#${fid}' class='name'>${name}</a> \
      <a class='details' href='#${id}'><img src='/assets/images/12-eye.png', alt='Fiche') /></a> \
      <a class='print' href='#${id}'><img src='/assets/images/185-printer.png', alt='Imprimer') /></a> \
      <br/>\
      <span>${place}</span> \
      <div style='clear: both'></div> \
  </li>"
  );

  $.template("locations.simple.ejs",
    "<li class='${className}'> \
      <div class='numbering' style='display: inline-block; float: left; width : 35px; text-align: right; padding-right: 10px; height:40px'>\
        <span>${number}</span> \
      </div>\
      <a href='#${fid}' class='name'>${name}</a> \
      <br/>\
      <span>${place}</span> \
      <div style='clear: both'></div> \
    </li>"
  );

  var data = [];
  for(var i = 0; i < locations.length; i++) {
    var attributes =  locations[i].attributes;
    var place = attributes["boundaries"]["0"]["name"];
    if (attributes["city_name"]) place = place + ", " + attributes["city_name"];
    var className = i % 2 == 1 ? "odd" : "even";
    var item = {
      className: className,
      place: place, number: i + 1,
      name: attributes["name"],
      id: attributes["id"],
      fid: locations[i].fid
    };
    data.push(item);
  }

  return $.tmpl(view, data);
}


