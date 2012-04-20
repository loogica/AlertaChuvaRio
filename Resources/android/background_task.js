Ti.include('/config.js');
Ti.include('/services/backend.js');
var _ = require('/lib/underscore')

pref = get_pref();

function process_region_info(i, region) {
    region.meta = {};
    
    if (region.ilustration.icon == "http://riomidia.cor.rio.gov.br/camadas/pluviometros/_sem_chuva_nuvem.png") {
        return null;
    } else{
        region.meta.image = '../images/redrain.png';
    }
    
    var situation_pattern = /Situação em [0-9]*\/[0-9]*\/[0-9]* - [0-9]*:[0-9]*/gi;
    var situation = region.description.text.match(situation_pattern);
    
    region.meta.info = region.taxonomies[0].value;
    region.meta.info_when = situation;
    
    return region;    
}

if (pref != null) {
    get_info_and_run(null, process_region_info, function(points) {
        var data = {};
        
        var my_rain_points = _.filter(points, function(elem) {
            return (elem.geoResult.point.lat == pref.my_place.latitude &&
                   elem.geoResult.point.lng == pref.my_place.longitude)
        });
        
        data['points'] = points;
        
        if (my_rain_points.length > 0) {
            data['is_raining'] = my_rain_points[0];
        }
        
        Ti.App.fireEvent('sync_information', data);
    });
}