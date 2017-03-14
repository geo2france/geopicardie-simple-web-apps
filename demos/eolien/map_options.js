var map_options = {
		div: "map",
		projection: new OpenLayers.Projection("EPSG:2154"),
//		projection: new OpenLayers.Projection("EPSG:900913"),
		displayProjection: new OpenLayers.Projection("EPSG:4326"),
//		numZoomLevels:18,
//		controls: [],
//		maxResolution: 78271.516964
		maxResolution: "auto",
		resolutions: [352.777588]
//		resolutions: [352.777588,176.388794,88.194397,35.277759,17.63888 0,8.819440,7.055552,5.291664,3.527776,2.645832,1.7 63888,0.881944]
};



/*var bounds = new OpenLayers.Bounds(99127,6049547,1242475,7110624);
var mapOptions = {
maxExtent:bounds,
maxResolution:"auto",
projection: "EPSG:2154",
controls: [new OpenLayers.Control.KeyboardDefaults()],
scales: [1000000, 500000, 250000, 100000, 50000, 25000, 20000, 15000, 10000, 7500, 5000, 2500],
resolutions: [352.777588,176.388794,88.194397,35.277759,17.63888 0,8.819440,7.055552,5.291664,3.527776,2.645832,1.7 63888,0.881944],
units: "degrees"
};*/