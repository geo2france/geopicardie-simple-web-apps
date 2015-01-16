var map_options_left = {
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
        "Open Mapquest": new L.TileLayer(
            'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>,<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.',
                subdomains: ['otile1','otile2','otile3','otile4'],
                format: 'image/jpeg'
            }),
        "Images aériennes 2002 - GéoPicardie": new L.tileLayer.wms(
            "http://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:picardie_ortho_2002',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            }),
        "Images aériennes 2008 & 2009 - GéoPicardie": new L.tileLayer.wms(
            "http://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:picardie_ortho_composite_2008_2009_vis',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            }),
        "Occupation du sol 1992 - GéoPicardie": new L.tileLayer.wms(
            "http://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:mos_picardie',
                styles: 'mos_picardie_1992_n4_complet',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            }),
        "Occupation du sol 2002 - GéoPicardie": new L.tileLayer.wms(
            "http://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:mos_picardie',
                styles: 'mos_picardie_2002_n4_complet',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            }),
        "Occupation du sol 2010 - GéoPicardie": new L.tileLayer.wms(
            "http://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:mos_picardie',
                styles: 'mos_picardie_2010_n4_complet',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            })
    },
    "init_view": {
        "center": [49.80241, 2.99025],
        "level": 15
    }
};

var map_options_right = {
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
        "Open Mapquest": new L.TileLayer(
            'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>,<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.',
                subdomains: ['otile1','otile2','otile3','otile4'],
                format: 'image/jpeg'
            }),
        "Images aériennes 2002 - GéoPicardie": new L.tileLayer.wms(
            "http://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:picardie_ortho_2002',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            }),
        "Images aériennes 2008 & 2009 - GéoPicardie": new L.tileLayer.wms(
            "http://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:picardie_ortho_composite_2008_2009_vis',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            }),
        "Occupation du sol 1992 - GéoPicardie": new L.tileLayer.wms(
            "http://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:mos_picardie',
                styles: 'mos_picardie_1992_n4_complet',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            }),
        "Occupation du sol 2002 - GéoPicardie": new L.tileLayer.wms(
            "http://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:mos_picardie',
                styles: 'mos_picardie_2002_n4_complet',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            }),
        "Occupation du sol 2010 - GéoPicardie": new L.tileLayer.wms(
            "http://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:mos_picardie',
                styles: 'mos_picardie_2010_n4_complet',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            })
    },
    "init_view": {
        "center": [49.80241, 2.99025],
        "level": 15
    }
};