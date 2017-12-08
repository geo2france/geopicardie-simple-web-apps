var map_options = {
  "base_map_layers": {
    "Scan25 IGN": new L.tileLayer.wms(
          "https://www.geopicardie.fr/geoserver/wms?", {
          layers: 'geopicardie:picardie_scan25',
          format: 'image/jpeg',
          attribution: "Scan25 - IGN"
        }),
    "OpenStreetMap - GéoPicardie": new L.tileLayer.wms(
        "https://osm.geopicardie.fr/mapproxy/service?", {
          layers: 'bright',
          format: 'image/jpeg',
          attribution: "OpenStreetMap - GéoPicardie"
        }),
    "Images aériennes - GéoPicardie": new L.tileLayer.wms(
        "https://www.geopicardie.fr/geoserver/wms?", {
          layers: 'picardie_ortho_ign_2013_vis',
          format: 'image/jpeg',
          attribution: "GéoPicardie"
        })
  },
  "init_view": {
    "center": [49.8029,2.99012],
    "level": 15
  },
  "default_base_map_layer": "scan25",
  "marker_coords": [49.8029,2.99012]
};


var base_map_layer_ids = {
  "Scan25 IGN": "scan25",
  "OpenStreetMap - GéoPicardie": "geopicosm",
  "Images aériennes - GéoPicardie": "geopicortho"
};
