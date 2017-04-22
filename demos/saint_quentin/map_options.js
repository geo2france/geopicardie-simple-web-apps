var map_options = {
	"base_map_layers": {
    "Scan25 IGN": new L.tileLayer.wms(
        "http://www.geopicardie.fr/geoserver/wms?", {
            layers: 'geopicardie:picardie_scan25',
            format: 'image/jpeg',
            attribution: "Scan25 - IGN"
        }),
    "Images aériennes": new L.tileLayer.wms(
        "http://www.geopicardie.fr/geoserver/wms?", {
                layers: 'agglo_st_quentin:agglo_st_quentin_ortho_2012_vis',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            }),
    "OpenStreetMap - GéoPicardie": new L.tileLayer.wms(
        "http://osm.geopicardie.fr/mapproxy/service?", {
          layers: 'bright',
          format: 'image/jpeg',
          attribution: "OpenStreetMap - GéoPicardie"
        })
	},
	"init_view": {
		"center": [49.8460,3.3110],
		"level": 15
	}
};
