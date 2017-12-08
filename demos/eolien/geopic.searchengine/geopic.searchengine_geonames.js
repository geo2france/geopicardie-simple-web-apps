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
  var search_request = "https://secure.geonames.org/searchJSON?q=" + this.current_search_string;
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

      this.found_places.push(new GeonamesFoundPlace(
        record.toponymName,
/*        record.fcodeName + " - " + record.adminName1,
*/        record.fcodeName,
        record.lat,
        record.lng));
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