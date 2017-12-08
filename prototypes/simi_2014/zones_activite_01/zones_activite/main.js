$(document).ready(function() {

  var map = init_map("map", map_options);
  init_base_maps_list(map_options);

  var overlayLayers = {};
  var subsetsOfFeatures = {"Toutes": [], "Pôles": [], "Sites": [], "Territoires": []};
  var subsetDefaultWidth = 0.002; // in degrees

  var selectedFeatureLayer;

  $.each( map_options.overlays, function( i, overlay ) {
    loadOverlayData(overlay);
  });

  setOverlayLayersVisibility();


  // Load the overlay data
  function loadOverlayData(overlay) {

    var overlayLayer;

    if (typeof overlayLayers[overlay.name] === "undefined") {

      console.log(overlay.name);

      overlayLayer = L.geoJson(null, {
        style: getStyleForFeature,
        onEachFeature: function (feature, layer) {
          layer.on({
            click: clickOnFeature
          });
        }
      });
      overlayLayers[overlay.name] = overlayLayer;
    }

    overlayLayer = overlayLayers[overlay.name];

    $.ajax({
      dataType: 'json',
      success: function(data) {

        $.each( data.features, function( i, feature ) {
          feature.properties.overlay_name = overlay.name;
          feature.properties.styles = overlay.styles;
          overlayLayer.addData(feature)

          subsetsOfFeatures["Toutes"].push(feature);

          switch (overlay.name) {
            case 'Pôles':
              subsetsOfFeatures["Pôles"].push(feature);
              addFeatureToPoleList(feature);
              break;

            case 'Sites':
              subsetsOfFeatures["Sites"].push(feature);
              idsite = feature.properties.idsite
              if(!(idsite in subsetsOfFeatures)) {
                subsetsOfFeatures[idsite] = [];
              }
              subsetsOfFeatures[idsite].push(feature);
              idpole = feature.properties.idpole
              if(!(idpole in subsetsOfFeatures)) {
                subsetsOfFeatures[idpole] = [];
              }
              subsetsOfFeatures[idpole].push(feature);
              break;

            case 'Territoires':
              subsetsOfFeatures["Territoires"].push(feature);
              idterritoire = feature.properties.id
              if(!(idterritoire in subsetsOfFeatures)) {
                subsetsOfFeatures[idterritoire] = [];
              }
              subsetsOfFeatures[idterritoire].push(feature);
              addFeatureToTerritoireList(feature);
              break;
          }
        });

      },
      fail: function( jqxhr, textStatus, error ) {
        console.log( textStatus + ', ' + error);
      },
      url: overlay.source
    });
  }  


  // Modify the visibility of the overlay layers according to the scale thresholds
  function setOverlayLayersVisibility() {

    $.each( map_options.overlays, function( i, overlay ) {
      overlayLayer = overlayLayers[overlay.name];

      if (map.getZoom() >= overlay.min_level && map.getZoom() <= overlay.max_level) {
        map.addLayer(overlayLayer);
        overlayLayer.bringToFront();
      } else {
        map.removeLayer(overlayLayer);
      }
    });
  }
 

  // Manage the appearence of the overlay features
  function getStyleForFeature(feature) {

    // If the feature does not have a styles property we stop here
    // Leaflet should set a default style
    if (typeof feature.properties.styles !== "undefined") {

      var baseLayersKeys = Object.keys(map_options.base_map_layers);
      var currentBaseMapLayerName = baseLayersKeys[map_options.current_base_map_layer_index];
      var style = $.extend(true, {}, feature.properties.styles.default);

      if (typeof feature.properties.styles.variations !== "undefined") {
        $.each( feature.properties.styles.variations, function( i, variation ) {
          if (typeof variation.select === "undefined" && typeof variation.base_map !== "undefined" && variation.base_map == currentBaseMapLayerName) {
            style = $.extend(style, variation.style);
          }
        });
      }

      // Selected feature
      if (typeof selectedFeatureLayer !== "undefined" && feature == selectedFeatureLayer.feature) {
        $.each( feature.properties.styles.variations, function( i, variation ) {
          if (typeof variation.select !== "undefined" && variation.select == true && typeof variation.base_map === "undefined") {
            style = $.extend(style, variation.style);
          }
        });

        $.each( feature.properties.styles.variations, function( i, variation ) {
          if (typeof variation.select !== "undefined" && variation.select == true && typeof variation.base_map !== "undefined" && variation.base_map == currentBaseMapLayerName) {
            style = $.extend(style, variation.style);
          }
        });
      }

      return style;
    }
  }

  // Event when a geojson feature is clicked on the map
  function clickOnFeature(e) {

    console.log(e.target.feature.properties);

    selectFeature(e.target);
  }


  // Select features of a layer
  function selectFeature(layer) {
    var previouslySelectedLayer = selectedFeatureLayer
    selectedFeatureLayer = layer;
    updateStyle(previouslySelectedLayer);
    updateStyle(selectedFeatureLayer);

    // If the feature is a "Site" we bring it to the top in order to make it much visible
    if ($.inArray(selectedFeatureLayer.feature, subsetsOfFeatures["Sites"]) > -1) {
      selectedFeatureLayer.bringToFront();
    }
  }


  // Update the style of the feature layer
  function updateStyle(layer) {
   if(typeof layer === "undefined") 
     return;

    // Retrieve the style that should be applied to the feature
    var feature = layer.feature;
    var style = getStyleForFeature(feature);

    // If we have a style and the feature has a setStyle method we set the style of the feature
    if (typeof style !== "undefined" && typeof layer.setStyle !== "undefined") {
      layer.setStyle(style);
    }
  }


  // Initialise the map and its layers control
  function init_map(map_id, map_options) {

    // Definition of the layers available in the maps
    var baseLayers = map_options.base_map_layers;
    var baseLayersKeys = Object.keys(baseLayers);
    var currentBaseMapLayer = baseLayers[baseLayersKeys[map_options.current_base_map_layer_index]];

    // Creation of the map
    var map = L.map(map_id).setView(map_options.init_view.center, map_options.init_view.level);

    map.addLayer(currentBaseMapLayer);

    return map;
  }

  // Initialise the base maps dropdown list
  function init_base_maps_list(map_options) {

    // The basemap_index variable will be used to set a unique id for each
    // item of the dropdown list of basemaps
    var basemap_index = 0;

    $.each( map_options.base_map_layers, function( name, layer ) {
      var menuItemId = "basemap-layer-" + basemap_index;
      var htmlCode = '<li role="presentation"><a id="' + menuItemId + '" role="menuitem" href="#">' + name + '</a></li>';

      // Add a menu item for the subset name
      $("#maps-list").append(htmlCode);

      // Set the function to be called by the click event on the menu item
      $("#"+menuItemId).on("click", function(e) {
        e.preventDefault();

        var baseLayers = map_options.base_map_layers;
        var baseLayersKeys = Object.keys(baseLayers);
        var currentBaseMapLayerName = baseLayersKeys[map_options.current_base_map_layer_index];
        var currentBaseMapLayer = baseLayers[currentBaseMapLayerName];

        // Make the previous basemap layer invisible and make the new one visible
        map.removeLayer(currentBaseMapLayer);
        map.addLayer(layer);

        // Save the index of the current basemap layer
        map_options.current_base_map_layer_index = parseInt(e.target.id.split("-").pop());

        // Loop on the overlay layers
        $.each( overlayLayers, function( i, overlayLayer ) {

          // Loop on the features of the overlay layer
          $.each( overlayLayer.getLayers(), function( i, layer ) {

            // Retrieve the style that should be applied to the feature
            var feature = layer.feature;
            var style = getStyleForFeature(feature);

            // If we have a style and the feature has a setStyle method we set the style of the feature
            if (typeof style !== "undefined" && typeof layer.setStyle !== "undefined") {
              layer.setStyle(style);
            }

          });

        });

      });
  
      // We increment the index of the basemap index
      basemap_index += 1;

    });

  }

  // Add a pole to the list of poles
  function addFeatureToPoleList (f) {
    var menuItemId = "nav-area-" + f.properties.idpole;
    var htmlCode = '<li role="presentation"><a id="' + menuItemId + '" role="menuitem" href="#">' + f.properties.Pole_nom + '</a></li>';

    // Add a menu item for the subset name
    $("#sites-list").append(htmlCode);

    // Set the function to be called by the click event on the menu item
    $("#"+menuItemId).on("click", function(e) {
      e.preventDefault();
      zoomToSubsetOfFeatures(f.properties.idpole);
    });
  }

  // Add a territory to the list of territories
  function addFeatureToTerritoireList (f) {
    var menuItemId = "nav-territory-" + f.properties.id;
    var htmlCode = '<li role="presentation"><a id="' + menuItemId + '" role="menuitem" href="#">' + f.properties.nom + '</a></li>';

    // Add a menu item for the subset name
    $("#territoires-list").append(htmlCode);

    // Set the function to be called by the click event on the menu item
    $("#"+menuItemId).on("click", function(e) {
      e.preventDefault();
      zoomToSubsetOfFeatures(f.properties.id);
    });
  }

  // Zoom on the extent of a set of features (given its name)
  function zoomToSubsetOfFeatures(subsetOfFeaturesName){
    // console.log(subsetOfFeaturesName);

    if (!(subsetOfFeaturesName in subsetsOfFeatures)) return;

    var subsetBounds = new L.LatLngBounds();

    $.each( subsetsOfFeatures[subsetOfFeaturesName], function( i, feature ) {

      if (feature.geometry.type == "Point") {
        var point = L.geoJson(feature);
        subsetBounds.extend(point);
      } else {
        var poly = L.geoJson(feature);
        subsetBounds.extend(poly.getBounds());
      }
    });

    var cx = (subsetBounds.getWest()+subsetBounds.getWest())/2.;
    var cy = (subsetBounds.getNorth()+subsetBounds.getSouth())/2.;
    if(subsetBounds.getEast()-subsetBounds.getWest() < subsetDefaultWidth) {
      subsetBounds.extend(new L.LatLng(cy, cx - (subsetDefaultWidth/2.)));
      subsetBounds.extend(new L.LatLng(cy, cx + (subsetDefaultWidth/2.)));
    }
    if(subsetBounds.getNorth()-subsetBounds.getSouth() < subsetDefaultWidth) {
      subsetBounds.extend(new L.LatLng(cy - (subsetDefaultWidth/2.), cx));
      subsetBounds.extend(new L.LatLng(cy + (subsetDefaultWidth/2.), cx));
    }

    map.fitBounds(subsetBounds.pad(0.2));
  };


  // Event sent when the user zoom in or zoom out
  map.on('zoomend ', function(e) {
    setOverlayLayersVisibility();
  });

});