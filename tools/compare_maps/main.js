$(document).ready(function() {

    // Initialisation of the maps
    var map_left = init_map("map_left", map_options_left, 0);
    var map_right = init_map("map_right", map_options_right, 2);

    // Synchronisation of the maps
    map_left.sync(map_right);
    map_right.sync(map_left);

    // Function calledto initialise the map and its layers control
    function init_map(map_id, map_options, default_layer_index) {

        // Definition of the layers available in the maps
        var base_layers = map_options.base_map_layers;
        var base_layers_keys = Object.keys(base_layers)
        var default_layer = base_layers[base_layers_keys[default_layer_index]]

        // Creation of the map
        var map = L.map(map_id).setView(map_options.init_view.center, map_options.init_view.level);
        default_layer.addTo(map);
        map.addControl(new L.control.layers(base_layers));

        return map;
    }
});