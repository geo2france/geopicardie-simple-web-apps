$(document).ready(function() {

	// Initialisation of the contextmenu options
	var contextmenu_options = {
		"contextmenu": true,
		"contextmenuWidth": 160,
	  	"contextmenuItems": [{
		      "text": 'Zoom in',
		      "icon": './img/icons/zoom-in.png',
		      "callback": zoomIn
			  }, {
	        "text": 'Zoom out',
	        "icon": './img/icons/zoom-out.png',
	        "callback": zoomOut
			  }]
  	};

	var map = init_map("map", map_options, contextmenu_options, 0);

	var currentLayerName = Object.keys(map_options.base_map_layers)[0];
	var subsetsOfFeatures = {"Toutes": []};
	var subsetDefaultWidth = 0.002; // in degrees

	var markerLayer = null;

    delete L.Icon.Default.prototype._getIconUrl
	var lightIcon  = L.Icon.Default.extend({options: {
	    iconUrl: 'images/marker-icon-bright.png',
        iconRetinaUrl: 'images/marker-icon-2x.png',
        shadowUrl: 'images/marker-shadow.png'
	}});
	var normalIcon  = L.Icon.Default.extend({options: {
	    iconUrl: 'images/marker-icon.png',
        iconRetinaUrl: 'images/marker-icon-2x.png',
        shadowUrl: 'images/marker-shadow.png'
	}});
	var darkIcon  = L.Icon.Default.extend({options: {
	    iconUrl: 'images/marker-icon-dark.png',
        iconRetinaUrl: 'images/marker-icon-2x.png',
        shadowUrl: 'images/marker-shadow.png'
	}});

	var oms = new OverlappingMarkerSpiderfier(map, {keepSpiderfied: true, nearbyDistance: 40});

	$.getJSON('./data/equipements_sportifs.js', function(data) {

		var bounds = new L.LatLngBounds();

		$.each( data.features, function( i, feature ) {
			var loc = new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
			bounds.extend(loc);

			var marker = new L.Marker(loc, {icon: new lightIcon()});
			marker.feature = feature;

			map.addLayer(marker);
			oms.addMarker(marker);

			subsetsOfFeatures["Toutes"].push(feature);
		});

//		map.fitBounds(bounds);
	})
	.fail(function( jqxhr, textStatus, error ) {
		console.log( textStatus + ', ' + error);
//				console.log( jqxhr.responseText);
	})

//	var popup = new L.Popup({closeButton: true, offset: new L.Point(0.5, -24)});

	var selectionInfo = {};

	oms.addListener('click', function(marker) {
		// Custom property in order to track the color/state of the marker
		if (selectionInfo.myMarker !== undefined && selectionInfo.myMarker !== null && selectionInfo.myMarker !== marker) {
			if ("on" === selectionInfo.spiderState) {
				selectionInfo.myMarker.setIcon(new normalIcon());
			}
			else {
				selectionInfo.myMarker.setIcon(new lightIcon());					
			}
		}

		marker.setIcon(new darkIcon());
		if(undefined !== marker.feature) {
			var feature = marker.feature;
			$("#equip-nom").text(feature.properties.NOM)
//			$("#equip-cat").text(feature.properties.SSCATOGORI)
			$("#equip-fiche").attr('href', feature.properties.URL_FICHE_)
			$("#equip-agenda").attr('href', feature.properties.URL_AGENDA)

			if(feature.properties.URL_FICHE_ == null) {
				$("#equip-fiche").hide();
				$("#equip-link-coma").hide();
			} else {
				$("#equip-fiche").show();
				$("#equip-link-coma").show();
			}
		}

		selectionInfo.myMarker = marker;
	});
	
	oms.addListener('spiderfy', function(markers) {
		for (var i = 0, len = markers.length; i < len; i ++) {
			markers[i].setIcon(new normalIcon());
		}

		// Custom property in order to track the color/state of the marker
		selectionInfo.spiderState = "on";
		selectionInfo.myMarker = null;
	});

	oms.addListener('unspiderfy', function(markers) {
		for (var i = 0, len = markers.length; i < len; i ++) {
			markers[i].setIcon(new lightIcon());
		}
		// Custom property in order to track the color/state of the marker
		selectionInfo.spiderState = "off";
	});

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

    function zoomIn (e) {
        map.zoomIn();
    }

    function zoomOut (e) {
        map.zoomOut();
    }

    // Listeners for the toolbar
	$( "#zoom_5k" ).click(function() {
		map.setZoom(18);
        return false;
	});

	$( "#zoom_25k" ).click(function() {
		map.setZoom(15);
        return false;
	});

	$( "#zoom_100k" ).click(function() {
		map.setZoom(12);
        return false;
	});

});