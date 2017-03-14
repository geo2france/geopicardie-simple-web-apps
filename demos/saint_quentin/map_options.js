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
    "Open Mapquest": new L.TileLayer(
				'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
					maxZoom: 18,
					attribution: '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>,<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.',
					subdomains: ['otile1','otile2','otile3','otile4'],
					format: 'image/jpeg'
				})
	},
	"init_view": {
		"center": [49.8460,3.3110],
		"level": 15
	}
};
