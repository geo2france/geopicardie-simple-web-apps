var map_options = {
    "base_map_layers": {
        "Scan25 IGN": new L.tileLayer.wms(
            "https://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:picardie_scan25',
                format: 'image/jpeg',
                attribution: "Scan25 - IGN"
            }),
        "OpenStreetMap contrasté - Géo2France": new L.tileLayer.wms(
            "https://osm.geo2france.fr/mapproxy/service?", {
              layers: 'bright',
              format: 'image/jpeg',
              attribution: "OpenStreetMap - Géo2France"
            }),
        "OpenStreetMap gris - Géo2France": new L.tileLayer.wms(
            "https://osm.geo2france.fr/mapproxy/service?", {
              layers: 'grey',
              format: 'image/jpeg',
              attribution: "OpenStreetMap - Géo2France"
            }),
        "OpenStreetMap naturaliste - Géo2France": new L.tileLayer.wms(
            "https://osm.geo2france.fr/mapproxy/service?", {
              layers: 'naturaliste',
              format: 'image/jpeg',
              attribution: "OpenStreetMap - Géo2France"
            }),
        "Images aériennes 2002 - GéoPicardie": new L.tileLayer.wms(
            "https://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:picardie_ortho_2002',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            }),
        "Images aériennes 2008 & 2009 - GéoPicardie": new L.tileLayer.wms(
            "https://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:picardie_ortho_composite_2008_2009_vis',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            }),
        "Images aériennes 2013 - GéoPicardie": new L.tileLayer.wms(
            "https://www.geopicardie.fr/geoserver/wms?", {
              layers: 'picardie_ortho_ign_2013_vis',
              format: 'image/jpeg',
              attribution: "GéoPicardie"
            }),
        "Occupation du sol 1992 - GéoPicardie": new L.tileLayer.wms(
            "https://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:mos_picardie',
                styles: 'mos_picardie_1992_n4_complet',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            }),
        "Occupation du sol 2002 - GéoPicardie": new L.tileLayer.wms(
            "https://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:mos_picardie',
                styles: 'mos_picardie_2002_n4_complet',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            }),
        "Occupation du sol 2010 - GéoPicardie": new L.tileLayer.wms(
            "https://www.geopicardie.fr/geoserver/wms?", {
                layers: 'geopicardie:mos_picardie',
                styles: 'mos_picardie_2010_n4_complet',
                format: 'image/jpeg',
                attribution: "GéoPicardie"
            })
    },
    "default_left_layer": "Images aériennes 2002 - GéoPicardie",
    "default_right_layer": "Images aériennes 2013 - GéoPicardie",
    "init_view": {
        "center": [49.80241, 2.99025],
        "level": 14
    }
};