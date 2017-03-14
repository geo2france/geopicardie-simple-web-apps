$(document).ready(function() {

  var map = init_map("map", map_options);
  init_base_maps_list(map_options);

  var overlayLayers = {};
  var currentBaseMapLayerName;
  var subsetsOfFeatures = {"Toutes": [], "Pôles": [], "Sites": [], "Territoires": []};
  var subsetDefaultWidth = 0.002; // in degrees


  $.each( map_options.overlays, function( i, overlay ) {

    var overlayLayer;

    if (undefined == overlayLayers[overlay.name]) {
      switch (overlay.name) {
        case 'Pôles':
          overlayLayer = L.geoJson();
          break;
        case 'Sites':
          overlayLayer = L.geoJson(null, {style: styleSiteLayer});
          break;
        case 'Territoires':
          overlayLayer = L.geoJson(null, {style: styleTerritoryLayer});
          break;
      }
      overlayLayers[overlay.name] = overlayLayer;
    }

    overlayLayer = overlayLayers[overlay.name];
    overlayLayer.on("click", clickOnFeature);

    $.ajax({
      dataType: 'json',
      success: function(data) {

        $.each( data.features, function( i, feature ) {
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
  });


  setOverlayLayersVisibility();

  // var popup = new L.Popup({closeButton: true, offset: new L.Point(0.5, -24)});
  // var selectionInfo = {};

  // Modify the visibility of the overlay layers according to the scale thresholds
  function setOverlayLayersVisibility() {

    $.each( map_options.overlays, function( i, overlay ) {
      overlayLayer = overlayLayers[overlay.name];

      if (map.getZoom() >= overlay.min_level && map.getZoom() <= overlay.max_level) {
        map.addLayer(overlayLayer);
      } else {
        map.removeLayer(overlayLayer);
      }
    });
  }
 

  // Manage the apearence of the territories layer
  function styleTerritoryLayer(feature) {
    return {
        weight: 2,
        opacity: 0.8,
        color: 'white',
        dashArray: '5',
        fillOpacity: 0.2,
        fillColor: 'yellow'
    };
  }

  // Manage the apearence of the sites layer
  function styleSiteLayer(feature) {
    return {
        weight: 3,
        opacity: 0.8,
        color: 'darkblue',
        // dashArray: '5',
        fillOpacity: 0.25,
        fillColor: 'cornflowerblue'
    };
  }

  // Event when a geojson feature is clicked on the map
  function clickOnFeature(e) {
    console.log(e.layer.feature.properties);
  };

  // Initialise the map and its layers control
  function init_map(map_id, map_options) {

    // Definition of the layers available in the maps
    var baseLayers = map_options.base_map_layers;
    var baseLayersKeys = Object.keys(baseLayers)
    currentBaseMapLayer = baseLayers[baseLayersKeys[map_options.current_base_map_layer_index]]

    // Creation of the map
    var map = L.map(map_id).setView(map_options.init_view.center, map_options.init_view.level);

    map.addLayer(currentBaseMapLayer);

    return map;
  }

  // Initialise the base maps dropdown list
  function init_base_maps_list(map_options) {
    var layer_index = 0;
    $.each( map_options.base_map_layers, function( name, layer ) {
      layer_index += 1;
      var menuItemId = "basemap-layer-" + layer_index;
      var htmlCode = '<li role="presentation"><a id="' + menuItemId + '" role="menuitem" href="#">' + name + '</a></li>';

      // Add a menu item for the subset name
      $("#maps-list").append(htmlCode);

      // Set the function to be called by the click event on the menu item
      $("#"+menuItemId).on("click", function(e) {

        console.log("Base maps changed");

        e.preventDefault();
        map.removeLayer(currentBaseMapLayer);
        map.addLayer(layer);
        currentBaseMapLayer = layer;
      });
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
    console.log(subsetOfFeaturesName);
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