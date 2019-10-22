$(window).on('load', function() {

/*function init() {*/

	Proj4js.defs["EPSG:2154"] = "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";

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

	// Increase reload attempts 
	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;

	var map;

	init_map();

	// Listener to the radio buttons used to change the base layer
	$("#basemap_layer_selector input[type=radio]").change(function(){
	    selectedBackgroundLayer = this.value;
	    selectBackgroundLayer(selectedBackgroundLayer);
	});

	// Listener to the checkboxes used to change the overlay layers visibility
	$("#overlay_selectors input[type=checkbox]").change(function(){
    	var selected_layers = [];

		switch(this.value) { 
			case "vent":
				selected_layers.push.apply(selected_layers, map.getLayersByName("Modélisation de la vitesse du vent à 40 m en Picardie"));
				break;

			case "mats":
				selected_layers.push.apply(selected_layers, map.getLayersByName("Mâts éoliens"));
				break;
			
			case "zfe":
				selected_layers.push.apply(selected_layers, map.getLayersByName("ZFE"));
				break;
		}

		for (var i = selected_layers.length - 1; i >= 0; i--) {
			selected_layers[i].setVisibility(this.checked);
		};

	});

    function init_map() {

        var format = new OpenLayers.Format.WMC({'layerOptions': {buffer: 0}});

        $.ajaxSetup({
            error: function(xhr, status, error) {
                console.log("An AJAX error occured: " + status + "\nError: " + error);
            }
        });

        // Load of a web map context
        context_file = './contexts/eolien.wmc'
        $.get( context_file, function( data ) {

            // Map initialisation with a web map context
            var jsonFormat = new OpenLayers.Format.JSON();
            var mapOptions = jsonFormat.read('{"div": "map", "allOverlays": true}');
            map = format.read(data, {map: mapOptions});
        //  map.addControl(new OpenLayers.Control.LayerSwitcher());
            map.zoomTo(4);

            selectBackgroundLayer("Fond OSM Géo2France");

        })
    };

    $( "#zoom_5k" ).click(function() {
		map.zoomTo(14);
        return false;
	});

	$( "#zoom_25k" ).click(function() {
		map.zoomTo(11);
        return false;
	});

	$( "#zoom_100k" ).click(function() {
		map.zoomTo(8);
        return false;
	});

	// Listener for the place nav list items
	$("#search-result-list").on("click", "a", function(){
		// Get the index of the clicked place
		var place_index = $(this).index();
		var found_place = search_engines[current_search_engine_index].found_places[place_index]

		// Get the bounding box of the clicked place
		place_bounds = found_place.bounds;

		// Convert these bounds into an OpenLayers object
		minx = found_place.bounds[3];
		miny = found_place.bounds[2];
		maxx = found_place.bounds[1];
		maxy = found_place.bounds[0];
		new_map_bounds = new OpenLayers.Bounds();
		new_map_bounds.extend(new OpenLayers.LonLat(minx, miny));
		new_map_bounds.extend(new OpenLayers.LonLat(maxx, maxy));
		map.zoomToExtent(new_map_bounds.transform('EPSG:4326', 'EPSG:2154'));

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
	});

    function selectBackgroundLayer(layerName) {
		var selected_layer;
		if(layerName !== "") {
			selected_layer = map.getLayersByName(layerName)[0];
		}

		for (var i = 5; i >= 0; i--) {
			map.layers[i].setVisibility(false);
		};

		if(undefined !== selected_layer) {
			selected_layer.setVisibility(true);
		}
    }

	function showLoadingIndicator(show) {
		if(show) {
			// Display the loading indicator
	        $('#loading-indicator').show();
		} else {
			// Hide the loading indicator
	        $('#loading-indicator').hide();
		}
	};

});