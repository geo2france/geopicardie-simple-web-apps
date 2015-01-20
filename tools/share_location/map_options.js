var map_options = {
  "base_map_layers": {
    "Scan25 IGN": new L.tileLayer.wms(
          "http://www.geopicardie.fr/geoserver/wms?", {
          layers: 'geopicardie:picardie_scan25',
          format: 'image/jpeg',
          attribution: "Scan25 - IGN"
        }),
    "OpenStreetMap - GéoPicardie": new L.tileLayer.wms(
        "http://www.geopicardie.fr/geoserver/wms?", {
          layers: 'autres:osm_geopicardie_bright',
          format: 'image/jpeg',
          attribution: "OpenStreetMap - GéoPicardie"
        }),
    "Images aériennes - GéoPicardie": new L.tileLayer.wms(
        "http://www.geopicardie.fr/geoserver/wms?", {
          layers: 'geopicardie:picardie_ortho_composite_2008_2009_vis',
          format: 'image/jpeg',
          attribution: "GéoPicardie"
        }),
    "Mapquest": new L.TileLayer(
        'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>,<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.',
          subdomains: ['otile1','otile2','otile3','otile4'],
          format: 'image/jpeg'
        }),
    "Stamen - Toner": new L.tileLayer(
      "http://{s}tile.stamen.com/toner/{z}/{x}/{y}.png", {
        subdomains: ['','a.','b.','c.','d.'],
        maxZoom: 18,
        attribution: '<a href="http://http://stamen.com/" target="_blank">Stamen</a>,<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.',
        type: 'image/jpeg'
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
  "Images aériennes - GéoPicardie": "geopicortho",
  "Mapquest": "mapquest",
  "Stamen - Toner": "stamentoner"
};
