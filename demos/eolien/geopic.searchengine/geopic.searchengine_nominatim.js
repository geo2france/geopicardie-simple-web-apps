// geonames.org search engine class
function GeonamesSearchEngine(id, name, startEndIndicatorFunction, options) {
  // Parent constructor
  SearchEngine.call(this, id , name, startEndIndicatorFunction);

  // Public properties
  this.options = {};
  $.extend(this.options, options);
}

GeonamesSearchEngine.prototype = Object.create(SearchEngine.prototype);

GeonamesSearchEngine.prototype._processSearchRequest = function(callback)
{
  var search_request = "http://api.geonames.org/searchJSON?q=" + this.current_search_string;
  search_request = search_request + "&isNameRequired=true"
  
  // Language
  if(undefined !== this.options.lang) {
    search_request = search_request + "&lang=" + this.options.lang;
  }

  // Country
  if(undefined !== this.options.country) {
    search_request = search_request + "&country=" + this.options.country;
  }

  // Admin code
  if(undefined !== this.options.admin_code) {
    search_request = search_request + "&adminCode1=" + this.options.admin_code;
  }

  // Feature classes
  if(undefined !== this.options.feature_classes) {
    for (var i = 0; i < this.options.feature_classes.length; i++) {
      search_request = search_request + "&featureClass=" + this.options.feature_classes[i];
    }
  }

  // User name
  if(undefined !== this.options.geonames_username) {
    search_request = search_request + "&username=" + this.options.geonames_username;
  }

  // Max records
  if(undefined !== this.options.max_records) {
    search_request = search_request + "&maxRows=" + this.options.max_records;
  }

  // Send the request to the search service et display the results
  $.getJSON(search_request, $.proxy(this._handleResponse, this));
};


GeonamesSearchEngine.prototype._handleResponse = function(json)
{
  // Any result?
  if (undefined != json && undefined != json.geonames && json.geonames.length > 0) {
    var record;
    var place_type;
    var place_name;
    var place_location_items;
    var place_location;

    // Update the found_places
    var geonames_records = json.geonames
  
    // Loop through the results set
    for (var i = 0; i < geonames_records.length; i++) {
      record = geonames_records[i]

      this.found_places.push(new GeonamesFoundPlace(record.toponymName, record.fcodeName, record.lat, record.lng));
    }
  }

  this.responseCallbackFunction();
};





// geonames.org place class
function GeonamesFoundPlace(name, description, lat, lng) {
  // Parent constructor
  FoundPlace.call(this, name, description);

  // Public properties
  this.center = [parseFloat(lat), parseFloat(lng)];
  this.bounds = [parseFloat(lat)+0.01, parseFloat(lng)+0.01, parseFloat(lat)-0.01, parseFloat(lng)-0.01];
}

GeonamesFoundPlace.prototype = Object.create(FoundPlace.prototype);


{   "id": "nominatim",
      "name": "Nominatim",
      "found_places": [],
      "last_searched_place_name": "",
      "query_template": "http://nominatim.openstreetmap.org/search?q=" +
          "$s" +
          "&format=json&polygon=0&addressdetails=1&countrycodes=fr&limit=9" +
          "&bounded=1&viewbox=0.15, 48.75, 5.20, 51.10",
      "response_handler": search_nominatim,
      "place_extent_accessor": get_found_place_extent_nominatim }


  // Handle search request sent to the nominatim web service
  function search_nominatim(json){
    // Update the found_places
    search_engines[current_search_engine_index].found_places = json
    found_places = search_engines[current_search_engine_index].found_places

    // Any result?
    if (json.length > 0){
    
      // Loop through the results set
      for (var i = 0; i < found_places.length; i++) {
        place = found_places[i]
        
        // Place type
        place_type = get_nominatim_place_type(place.class, place.type);
        place_name = place.display_name.split(", ")[0];
        place_name += ' (' + place_type + ')';

        // Place location (juste remove the first element)
        place_location = place.display_name.split(", ").slice(1).join(", ");

        $("#search-result-list").append('<a href="#" class="list-group-item">' +
            '<h4 class="list-group-item-heading">' + place_name + '</h4>' +
            '<p class="list-group-item-text">' + place_location + '</p>' +
          '</a>');

      }
      
      // Hide the loading indicator
      $('#loading-indicator').hide();
      return true;

    } else {
      $('#loading-indicator').hide();
      $("#search-result-list").append('Aucun résultat n\'a été trouvé');
      return false;
    }
  }


  // Get the geographic extent (WGS84) of a place eturned by the Nominatim search engine
  function get_found_place_extent_nominatim(place_index) {

    // Reference the found places related to the surrent search engine
    var found_places = search_engines[current_search_engine_index].found_places;

    var latLng1 = new L.LatLng(found_places[place_index].boundingbox[0], found_places[place_index].boundingbox[3]);
    var latLng2 = new L.LatLng(found_places[place_index].boundingbox[1], found_places[place_index].boundingbox[2]);
    var bounds = new L.LatLngBounds(latLng1, latLng2);

    return bounds;
  }

  // Translation of classes and types of features into custom place types
  function get_nominatim_place_type(feature_class, feature_type){
    place_type = feature_class + ", " + feature_type;

    switch(feature_class) {
      case "boundary":
        switch(feature_type) {
          case "national_park":
            place_type = "parc naturel national";
            break;
          case "protected_area":
            place_type = "zone protégée, parc, réserve";
            break;
          default:
            place_type = "limite administrative";
        }
        break;
      case "railway":
        switch(feature_type) {
          case "station":
            place_type = "gare ferroviaire";
            break;
          case "halte":
            place_type = "gare, arrêt";
            break;
          default:
            place_type = "infrastructure ferroviaire";
        }
        break;
      case "highway":
        place_type = "voie";
        break;
      case "place":
        switch(feature_type) {
          case "city":
          case "town":
            place_type = "ville";
            break;
          case "village":
            place_type = "village";
            break;
          case "hamlet":
            place_type = "hameau";
            break;
          case "suburb":
            place_type = "quartier";
            break;
          case "island":
            place_type = "île";
            break;
          default:
            place_type = "localité";
        }
        break;
      case "tourism":
        switch(feature_type) {
          case "hotel":
            place_type = "hôtel";
            break;
          default:
            place_type = "tourisme";
        }
        break;
      case "building":
        place_type = "bâtiment";
        break;
      case "amenity":
        switch(feature_type) {
          case "townhall":
            place_type = "mairie";
            break;
          case "public_building":
            place_type = "bâtiment public";
            break;
          case "hospital":
            place_type = "hôpital";
            break;
          case "school":
          case "college":
          case "university":
            place_type = "enseignement";
            break;
          case "restaurant":
            place_type = "restaurant";
            break;
          default:
            place_type = "service, commerce";
        }
        break;
      case "shop":
      case "office":
        place_type = "service, commerce";
        break;
      case "tunnel":
        place_type = "tunnel";
        break;
      case "waterway":
        switch(feature_type) {
          case "river":
            place_type = "rivière";
            break;
          default:
            place_type = "cours d'eau";
        }
        break;
      case "aeroway":
        switch(feature_type) {
          case "aerodrome":
            place_type = "aerodrome";
            break;
          default:
            place_type = "infrastructure aéroportuaire";
        }
        break;
      case "natural":
        switch(feature_type) {
          case "water":
            place_type = "étendue d'eau";
            break;
        }
        break;
      case "landuse":
        switch(feature_type) {
          case "forest":
            place_type = "forêt";
            break;
        }
        break;
    }

    return place_type;
  }


