var map_options = {
	"base_map_layers": {
    "OpenStreetMap GéoPicardie": new L.tileLayer.wms(
	    		"http://www.geopicardie.fr/geoserver/wms?", {
					layers: 'autres:basemaps_google',
					format: 'image/jpeg',
					attribution: "OpenStreetMap - GéoPicardie"
				}),
    "OpenStreetMap GéoPicardie 2": new L.tileLayer.wms(
	    		"http://www.geopicardie.fr/geoserver/wms?", {
					layers: 'autres:osm_geopicardie_bright',
					format: 'image/jpeg',
					attribution: "OpenStreetMap - GéoPicardie"
				}),
    "OpenStreetMap GéoBretagne": new L.tileLayer.wms(
	    		"http://geobretagne.fr/geoserver/osm/ows", {
					layers: 'map-simple',
					format: 'image/jpeg',
					attribution: "OpenStreetMap"
				}),
    "Open Mapquest": new L.TileLayer(
				'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
					maxZoom: 18,
					attribution: '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>,<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.',
					subdomains: ['otile1','otile2','otile3','otile4'],
					format: 'image/jpeg'
				}),
    "Scan25 IGN": new L.tileLayer.wms(
	    		"http://www.geopicardie.fr/geoserver/wms?", {
					layers: 'geopicardie:picardie_scan25',
					format: 'image/jpeg',
					attribution: "Scan25 - IGN"
				}),
    "Images aériennes": new L.tileLayer.wms(
    		"http://www.geopicardie.fr/geoserver/wms?", {
					layers: 'geopicardie:picardie_ortho_composite_2008_2009_vis',
					format: 'image/jpeg',
					attribution: "GéoPicardie"
				})
	},
	current_base_map_layer_index: 0,
	"overlays": [
		{
			name: "Territoires",
			source: "data/territoires_poly.geojson",
			min_level: "0",
			max_level: "13"
		},
		{
			name: "Sites",
			source: "data/za_simi2014.geojson",
			min_level: "12",
			max_level: "20"
		},
		{
			name: "Pôles",
			source: "data/poles_points.geojson",
			min_level: "10",
			max_level: "11",
			marker: L.Icon.Default.extend({options: {iconUrl: 'images/marker-icon-bright.png'}})
		}
	],
	"init_view": {
		"center": [49.8460,2.75],
		"level": 8
	}
};
