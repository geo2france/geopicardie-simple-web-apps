$(document).ready(function() {

    // Initialisation of the map
    var map = initMap("map", map_options);

    // Load the contents of the dropdown lists
    initDropdownLists();

    // Listeners for the dropdown lists
    $( "#left_layer" ).change(function() {
        if(map_options.left_layer != map_options.right_layer) {
            map.removeLayer(map_options.left_layer);
        }
        var leftLayer = map_options.base_map_layers[$("#left_layer").val()];
        leftLayer.addTo(map_options.map);
        map_options.sbs_control.setLeftLayers(leftLayer);
        map_options.left_layer = leftLayer
    });

    $( "#right_layer" ).change(function() {
        if(map_options.right_layer != map_options.left_layer) {
            map.removeLayer(map_options.right_layer);
        }
        var rightLayer = map_options.base_map_layers[$("#right_layer").val()];
        rightLayer.addTo(map_options.map);
        map_options.sbs_control.setRightLayers(rightLayer);
        map_options.right_layer = rightLayer
    });

    // Function called to initialise the map and its layers control
    function initMap(map_id, map_options) {

        // Definition of the layers available in the maps
        var base_layers = map_options.base_map_layers;
        var base_layers_keys = Object.keys(base_layers)
        var default_layer_left = base_layers[map_options.default_left_layer]
        var default_layer_right = base_layers[map_options.default_right_layer]

        // Creation of the map
        var map = L.map(map_id).setView(map_options.init_view.center, map_options.init_view.level);
        default_layer_left.addTo(map);
        default_layer_right.addTo(map);

        map_options.map = map;
        map_options.left_layer = default_layer_left;
        map_options.right_layer = default_layer_right;
        map_options.sbs_control = L.control.sideBySide(default_layer_left, default_layer_right);
        map_options.sbs_control.addTo(map);

        return map;
    }

    // Initialise the contents of the srs dropdown lists
    function initDropdownLists() {
        var left_layer_select = $("#left_layer");
        var right_layer_select = $("#right_layer");

        // Erase the content of the dropdown lists
        left_layer_select.empty();
        right_layer_select.empty();

        // Populate the dropdown lists
        $.each(map_options.base_map_layers, function(index, value) {

            var layer_name = index;
            var layer = value;
            var option_html = '<option>' + layer_name + '</option>';
            var option_html_selected = '<option selected="selected">' + layer_name + '</option>';

            if(layer == map_options.left_layer) {
                left_layer_select.append(option_html_selected);
            } else {
                left_layer_select.append(option_html);
            }

            if(layer == map_options.right_layer) {
                right_layer_select.append(option_html_selected);
            } else {
                right_layer_select.append(option_html);
            }
        });
    }

});
