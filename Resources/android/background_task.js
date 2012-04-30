Ti.include('/config.js');
Ti.include('/services/backend.js');
var _ = require('/lib/underscore')

pref = get_pref();

function process_region_info(i, region) {
    if (region.taxonomies) {
    region.meta = {};
    
    var volume_string = region.taxonomies[0].value;
    var volume = parseFloat(volume_string.replace(" mm", ""));
    
    if (volume == 0) {
        return null;
    } else{
        region.meta.image = '../images/redrain.png';
    }
    
    var situation_pattern = /Situação em [0-9]*\/[0-9]*\/[0-9]* - [0-9]*:[0-9]*/gi;
    var situation = region.description.text.match(situation_pattern);
    
    if (situation == null) {
        situation_pattern = /Situação em [0-9]*-[0-9]*-[0-9]* [0-9]*:[0-9]*/gi;
        situation = region.description.text.match(situation_pattern);
    }
    
    var title = region.name.replace('Pluviômetros (Alerta-Rio) -  ', '');
    if (title == "Baia de Guanabara") {
        title = "";
        Ti.API.info(region.description.text);
        var title_pattern = /Estação\/Bacia:(.*)\/Baia de Guanabara/; 
        var title_array = region.description.text.match(title_pattern);
        title = title_array[1];
    }
    
    region.meta.name = title;   
    region.meta.info = region.taxonomies[0].value;
    region.meta.info_when = situation;
    region.meta.volume = volume;
    
    return region;
    }
    return null;    
}

if (pref != null && pref.my_place != null) {
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