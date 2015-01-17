$(document).ready(function() {

  var current_search_engine_index = 0;
  var search_engines = [new GeonamesSearchEngine(0, "geonames.org", 
    function(show) {
      if(show) {
        // Display the loading indicator
        $('#loading-indicator').show();
      } else {
        // Hide the loading indicator
        $('#loading-indicator').hide();
      }
    },
    geonames_options)];


  // Initialisation of the contextmenu options
  var contextmenu_options = {
    "contextmenu": true,
    "contextmenuWidth": 160,
    "contextmenuItems": [{
        "text": 'Centrer la carte ici',
        "icon": '../img/icons/location.png',
        "callback": centerMapHere
      }, {
        "text": 'Zoom in',
        "icon": '../img/icons/zoom-in.png',
        "callback": zoomIn
      }, {
        "text": 'Zoom out',
        "icon": '../img/icons/zoom-out.png',
        "callback": zoomOut
      }, '-', {
        "text": 'Placer la punaise ici',
        "icon": '../img/icons/marker.png',
        "callback": moveMarkerHere
      }]
    };

  var map = init_map("map", map_options, contextmenu_options, 0);

  var currentLayerId = base_map_layer_ids[Object.keys(map_options.base_map_layers)[0]];
  var subsetDefaultWidth = 0.002; // in degrees
  var markerLayer = null;

  var marker = L.marker(map.getCenter(), {draggable: true}).addTo(map);
  marker.on('dragend', movedMarker);
  map.on('move', movedMap);
  map.on('zoomend', movedMap);
  map.on('baselayerchange', baseLayerChanged);

  updateMapFromLocationHash();


  // Initialise the map and its layers control
  function init_map(map_id, map_options, contextmenu_options, default_layer_index) {

    // Definition of the layers available in the maps
    var base_layers = map_options.base_map_layers;
    var base_layers_keys = Object.keys(base_layers)
    var default_layer = base_layers[base_layers_keys[default_layer_index]]

    // Creation of the map
    var map = L.map(map_id, contextmenu_options).setView(map_options.init_view.center, map_options.init_view.level);
    default_layer.addTo(map);
    map.addControl(new L.control.layers(base_layers));

    return map;
  }

  // Functions used by the leaflet contextual menu
  function centerMapHere (e) {
    map.panTo(e.latlng);
    updateUrl();
  }

  function zoomIn (e) {
    map.zoomIn();
    updateUrl();
  }

  function zoomOut (e) {
    map.zoomOut();
    updateUrl();
  }

  function moveMarkerHere (e) {
    marker.setLatLng(e.latlng);
    updateUrl();
  }


  // Listeners for the toolbar
  $( "#recenter_map_marker" ).click(function() {
    map.setView(marker.getLatLng(), map.getZoom());
    updateUrl();
    return false;
  });

  $( "#recenter_map_amiens" ).click(function() {
    map.setView([49.89463,2.29777], map.getZoom());
    updateUrl();
    return false;
  });

  $( "#recenter_map_beauvais" ).click(function() {
    map.setView([49.43291,2.08311], map.getZoom());
    updateUrl();
    return false;
  });

  $( "#recenter_map_laon" ).click(function() {
    map.setView([49.56619,3.6254], map.getZoom());
    updateUrl();
    return false;
  });


  $( "#move_marker" ).click(function() {
    marker.setLatLng(map.getCenter());
    updateUrl();
    return false;
  });

  $( "#zoom_5k" ).click(function() {
    map.setZoom(16);
    updateUrl();
    return false;
  });

  $( "#zoom_25k" ).click(function() {
    map.setZoom(14);
    updateUrl();
    return false;
  });

  $( "#zoom_100k" ).click(function() {
    map.setZoom(12);
    updateUrl();
    return false;
  });


  // Listener for the place nav list items
  $("#search-result-list").on("click", "a", function(){
    // Get the index of the clicked place
    var place_index = $(this).index();
    var found_place = search_engines[current_search_engine_index].found_places[place_index]

    // Get the bounding box of the clicked place
    bounds = found_place.bounds;
    map.fitBounds(new L.LatLngBounds(new L.LatLng(bounds[0], bounds[1]),
      new L.LatLng(bounds[2], bounds[3])), {
      padding: [15,15]
    });

    marker.setLatLng(found_place.center);

    return false;
  });

  //Listener for the place search
  $("#search_button").click(function(){

    // Clear the result lists
    $("#search-result-list").empty();

    // Display the loading indicator
    showLoadingIndicator(true);

    // Get the input string
    input_string = $("#place_name_input").val();
    
    // Get the index of the selected search engine
    search_engines[current_search_engine_index].processNewSearch(input_string, function() {
      var found_places = search_engines[current_search_engine_index].found_places;

      // Update the content of the result list
      // Any result?
      if (found_places.length > 0) {
        // Loop through the results set
        for (var i = 0; i < found_places.length; i++) {
          place = found_places[i]
          
          place_string = '<strong>' + place.name + '</strong>';
          place_string += ' <em> (' + place.description + ')</em>';

          $("#search-result-list").append('<a href="#" class="list-group-item">' +
              '<small>' + place_string + '</small>' +
            '</a>');
        }
        
        // Hide the loading indicator
        $('#loading-indicator').hide();
        return true;

      } else {
        // Hide the loading indicator
        $('#loading-indicator').hide();
        $("#search-result-list").append('Aucun résultat n\'a été trouvé');
        return false;
      }
    });

    // To avoid the page to be reloading on the submit event
    return false;
  })

  function showLoadingIndicator(show) {
    if(show) {
      // Display the loading indicator
      $('#loading-indicator').show();
    } else {
      // Hide the loading indicator
      $('#loading-indicator').hide();
    }
  }

  function baseLayerChanged(event) {
    currentLayerName = event.name;
    currentLayerId = base_map_layer_ids[currentLayerName];
    updateUrl();
  }

  function movedMap() {
    updateUrl();
  }

  function movedMarker() {
    if (map.hasLayer(marker)) {
    }
    updateUrl();
  }

  function updateUrl() {
    lat = Math.floor(map.getCenter().lat * 100000) / 100000;
    lng = Math.floor(map.getCenter().lng * 100000) / 100000;
    mlat = Math.floor(marker.getLatLng().lat * 100000) / 100000;
    mlng = Math.floor(marker.getLatLng().lng * 100000) / 100000;
    zoom = map.getZoom();
    newHash = '#map=' + zoom + '/' + lat +  '/' + lng + '&layer=' + currentLayerId + '&marker=' + mlat +  '/' + mlng;
    window.location.hash = newHash;
    $('#permalink').val(newHash);
    $('#permalink').val(window.location.href);
  }

  function updateMapFromLocationHash() {
    var hashParams = getHashParams();

    if( hashParams["layer"] !== undefined ) {
      var layerId = hashParams["layer"];
      var newBaseLayer = map_options.base_map_layers[getLayerNameFromId(layerId)];
      var currentBaseLayer = map_options.base_map_layers[getLayerNameFromId(currentLayerId)];
      map.removeLayer(currentBaseLayer);
      map.addLayer(newBaseLayer);
    }

    if( hashParams["map"] !== undefined ) {
      var mapView = hashParams["map"].split('/');
      map.setView(new L.LatLng(parseFloat(mapView[1]), parseFloat(mapView[2])), parseInt(mapView[0]));
    }

    if( hashParams["marker"] !== undefined ) {
      var markerCoords = hashParams["marker"].split('/');
      marker.setLatLng(new L.LatLng(parseFloat(markerCoords[0]), parseFloat(markerCoords[1])));
    }
  }


  function getLayerNameFromId(layerId) {
    for (var key in base_map_layer_ids) {
      // console.log(key);
      // console.log(base_map_layer_ids[key]);
      var id = base_map_layer_ids[key];
      if(id == layerId) {
        return key;
      }
    }
  }


  // Function copied from http://stackoverflow.com/questions/4197591/parsing-url-hash-fragment-identifier-with-javascript
  function getHashParams() {

    var hashParams = {};
    var e,
      a = /\+/g,  // Regex for replacing addition symbol with a space
      r = /([^&;=]+)=?([^&;]*)/g,
      d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
      q = window.location.hash.substring(1);

    while (e = r.exec(q))
      hashParams[d(e[1])] = d(e[2]);

    return hashParams;
  }

});