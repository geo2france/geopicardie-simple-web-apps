// Abstract search engine class
// This class should not be instantited directly
// Please instantiate derived classes
function SearchEngine(id, name, startEndIndicatorFunction) {
  // Public properties
  this.id = id;
  this.name = name;
	this.found_places = [];
	this.current_search_string = "";
	this.previous_search_string = "";

  this.startEndIndicatorFunction = startEndIndicatorFunction;
  this.responseCallbackFunction = 1;
}

SearchEngine.prototype.getCurrentResultsBounds = function()
{
  console.log('getCurrentResultsBounds');
  var n,s,e,w;

  return [];
};

SearchEngine.prototype.processNewSearch = function(search_string, callback)
{
  this.previous_search_string = this.current_search_string;
  this.current_search_string = search_string;
	this.found_places = [];
  this.responseCallbackFunction = callback;

  this._processSearchRequest();
};



// FounbdPlace class
// Used by the SearchEngine class for managing sarch results 
function FoundPlace(name, description) {
  // Public properties
  this.name = name;
  this.description = description;
  this.center;
  this.bounds;
}

