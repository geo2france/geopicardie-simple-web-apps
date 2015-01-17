$(document).ready(function() {

  var scan25_layer = L.tileLayer.wms("http://www.geopicardie.fr/geoserver/wms?", {
    layers: 'geopicardie:picardie_scan25',
    format: 'image/jpeg',
    attribution: "Scan25 - IGN"
  });

  var ortho_layer = L.tileLayer.wms("http://www.geopicardie.fr/geoserver/wms?", {
    layers: 'geopicardie:picardie_ortho_composite_2008_2009_vis',
    format: 'image/jpeg',
    attribution: "GéoPicardie"
  });

  var osm_layer = L.tileLayer.wms("http://www.geopicardie.fr/geoserver/wms?", {
    layers: 'autres:osm_geopicardie_bright',
    format: 'image/jpeg',
    attribution: "OpenStreetMap - GéoPicardie"
  });

  var mapquest_layer = new L.TileLayer(
    'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>,<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.',
      subdomains: ['otile1','otile2','otile3','otile4'],
      format: 'image/jpeg'
    }
  );
 
  var stamen_toner_layer = new L.tileLayer(
    "http://{s}tile.stamen.com/toner/{z}/{x}/{y}.png", {
      subdomains: ['','a.','b.','c.','d.'],
      maxZoom: 18,
      attribution: '<a href="http://http://stamen.com/" target="_blank">Stamen</a>,<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.',
      type: 'image/jpeg'});

  var baseMaps = {
      "Scan25 IGN": scan25_layer,
      "OpenStreetMap - GéoPicardie": osm_layer,
      "Images aériennes - GéoPicardie": ortho_layer,
      "Mapquest": mapquest_layer,
      "Stamen - Toner": stamen_toner_layer
  };

  var mapLayersOptions = {
    baseMaps: baseMaps
  };

  var map = L.map('map').setView([49.80241, 2.99025], 15);
  var subsetDefaultWidth = 0.002; // in degrees
  var markerLayer = null;

  var defaultLayerName = Object.keys(baseMaps)[0];
  var defaultLayer = baseMaps[defaultLayerName];
  defaultLayer.addTo(map);
  var currentLayerName = defaultLayerName;

  L.control.layers(baseMaps).addTo(map);

  var marker = L.marker([49.80241, 2.99025], {draggable: true}).addTo(map);
  marker.on('dragend', movedMarker);

  // Load the srs in the dropdown list
  initDropdownLists();

  // Make sure the coords displayed in the forms are synchronised
  // with the coords of the map marker
  updateCoordsFromMapMarker();

  // Listeners for the map toolbar
  $( "#recenter_map" ).click(function() {
    map.setView(marker.getLatLng(), map.getZoom());
    updateCoordsFromMapMarker();
  });

  $( "#move_marker" ).click(function() {
    marker.setLatLng(map.getCenter());
    updateCoordsFromMapMarker();
  });

  $( "#zoom_region" ).click(function() {
    map.setZoom(8);
    updateCoordsFromMapMarker();
  });

  $( "#zoom_town" ).click(function() {
    map.setZoom(12);
    updateCoordsFromMapMarker();
  });

  $( "#zoom_street" ).click(function() {
    map.setZoom(16);
    updateCoordsFromMapMarker();
  });

  // Listeners for the srs dropdown lists
  $( "#input_srs" ).change(function() {
    var input_srs = my_srs.srs_dict[$("#input_srs").val()]
/*    var input_srs_def = input_srs.def;
    var srs_type = input_srs.type;
*/
    $("#input_group_x > span.input-group-addon").text(input_srs.x_label);
    $("#input_group_y > span.input-group-addon").text(input_srs.y_label);

    updateCoordsFromMapMarker();
  });

  $( "#output_srs" ).change(function() {
    var output_srs = my_srs.srs_dict[$("#output_srs").val()]
/*    var output_srs_def = output_srs.def;
    var srs_type = output_srs.type;
*/
    $("#output_group_x > span.input-group-addon").text(output_srs.x_label);
    $("#output_group_y > span.input-group-addon").text(output_srs.y_label);

    updateCoordsFromMapMarker();
  });


  // Function called when the map marker is moved
  function movedMarker() {
    updateCoordsFromMapMarker();
  }

  // Initialise the contents of the srs dropdown lists
  function initDropdownLists() {
    var input_srs_select = $("#input_srs");
    var output_srs_select = $("#output_srs");

    // Erase the content of the dropdown lists
    input_srs_select.empty();
    output_srs_select.empty();

    // Populate the dropdown lists
    $.each(my_srs.srs_dict, function(index, value) {

      var srs_id = index;
      var srs_name = value.name;
      var option_html = '<option value="' + srs_id + '">' + srs_name + '</option>';
      var option_html_selected = '<option value="' + srs_id + '" selected="selected">' + srs_name + '</option>';

      if(srs_id == my_srs.input_srs) {
        input_srs_select.append(option_html_selected);
      } else {
        input_srs_select.append(option_html);
      }

      if(srs_id == my_srs.output_srs) {
        output_srs_select.append(option_html_selected);
      } else {
        output_srs_select.append(option_html);
      }
    });
  }


  // Update the displayed coords
  function updateCoordsFromMapMarker() {
    // Retrival of the maker coords
    var marker_lat = marker.getLatLng().lat;
    var marker_lng = marker.getLatLng().lng;

    // Get the srs properties
    var input_srs = my_srs.srs_dict[$("#input_srs").val()]
    var input_srs_def = input_srs.def;
    var output_srs = my_srs.srs_dict[$("#output_srs").val()]
    var output_srs_def = output_srs.def;
    var marker_srs_def = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

    // Coordinate conversion
    var new_input_coords = proj4(marker_srs_def,input_srs_def,[marker_lng,marker_lat]);
    var new_output_coords = proj4(marker_srs_def,output_srs_def,[marker_lng,marker_lat]);

    // Update the displayed coords
    // The precision of the decimal numbers depends on the type of srs
    if(input_srs.type == 'proj') {
      $('#input_x').val(new_input_coords[0].toFixed(2));
      $('#input_y').val(new_input_coords[1].toFixed(2));
    } else {
      $('#input_x').val(new_input_coords[0].toFixed(7));
      $('#input_y').val(new_input_coords[1].toFixed(7));
    }

    if(output_srs.type == 'proj') {
      $('#output_x').val(new_output_coords[0].toFixed(2));
      $('#output_y').val(new_output_coords[1].toFixed(2));
    } else {
      $('#output_x').val(new_output_coords[0].toFixed(7));
      $('#output_y').val(new_output_coords[1].toFixed(7));
    }

  }

});