Ti.include('/config.js');
Ti.include('/services/backend.js');

var initial_preferences = {
    my_place: null
};


var raining = false;


//MapView Component Constructor
function MapView() {
	
	//create object instance, a parasitic subclass of Observable
	var self = Titanium.Map.createView({
		top: 44,
	    mapType: Titanium.Map.STANDARD_TYPE,
	    region: {latitude:-22.977675726196445, longitude:-43.24390411376953, 
	            latitudeDelta:0.35, longitudeDelta:0.35},
	    animate:true,
	    regionFit:true,
	    userLocation:true,
	    annotations:[]
	});
	
	self.setMapCenter = function(position, delta) {
		if (delta) {
			var region = {
				latitude: position.latitude,
				longitude: position.longitude,
				animate: true,
				latitudeDelta: delta.latitude,
				longitudeDelta: delta.longitude
			}
		}
		else {
			var region = {
				latitude: position.latitude,
				longitude: position.longitude,
				animate: true
			}
		}
		
		self.setLocation(region);
	};
	
	self.getLocation = function(){
		//Get the current position and set it to the mapview
		Titanium.Geolocation.getCurrentPosition(function(e){
			if (e.error){
				Ti.API.log('error: ' + JSON.stringify(e.error) );
				alert('consertar localizacao no emulador');
            	return;
			}
			else{
				var position = {
					latitude: e.coords.latitude,
					longitude: e.coords.longitude
				};
				var delta = {
					latitude: 0.35,
					longitude: 0.35
				};
				self.setMapCenter(position, delta);
		  }
		});
	}
	
	function create_map_annotation(i, region) {
	    var image = "";
	    var volume_string = region.taxonomies[0].value;
	    var volume = parseFloat(volume_string.replace(" mm", ""));
        if (volume == 0) {
            image = '../images/norain.png';
        }
        else if (volume <= 5){
            image = '../images/yellowrain.png';
        }
        else if (volume <= 25) {
        	image = '../images/orangerain.png';
        }
        else if (volume > 25) {
        	image = '../images/redrain.png';
        };
        
        var history_pattern = /[0-9]*.[0-9]* mm/g;
        var history = region.description.text.match(history_pattern);
        var history_text = "1h: " + history[1] + ' | 4hs: ' + history[2] + '\n24hs: ' + history[3] + ' | 96hs ' + history[4];
        
        var situation_pattern = /Situação em [0-9]*\/[0-9]*\/[0-9]* - [0-9]*:[0-9]*/gi;
        var situation = region.description.text.match(situation_pattern);
        
        if (situation == null) {
        	situation_pattern = /Situação em [0-9]*-[0-9]*-[0-9]* [0-9]*:[0-9]*/gi;
        	situation = region.description.text.match(situation_pattern);
        }
        
        if (history[1] == null){
        	history_text = ""
        }
        
        var subtitle = volume_string + " (" + situation + ")" + '\n' + history_text;
        
        var rview = Titanium.UI.createView({
               //backgroundColor:'red',
               width:50,
               height:50
        }); 
        
        var lable_local = Ti.UI.createButton({
            //text: 'Meu Local',
            local_id: i+1,
            latitude: region.geoResult.point.lat,
            longitude: region.geoResult.point.lng,
            //title: region.name.replace('Pluviômetros (Alerta-Rio) -  ', ''),
            image: '/images/rain_icon.png',
            annotation: null
        });
        
        lable_local.addEventListener("click", function(e) {
            Ti.API.debug("botao clicado: " + e.source.local_id);
            
            preferences = get_pref();
            preferences['my_place'] = {};
            
            preferences['my_place']['name'] = e.source.title;
            preferences['my_place']['id'] = e.source.local_id;
            preferences['my_place']['latitude'] = e.source.latitude;
            preferences['my_place']['longitude'] = e.source.longitude;
            
            save_pref(preferences);
            
            alert('Local salvo com sucesso!');
            
            self.deselectAnnotation(e.source.annotation)
            
        });
        
        rview.add(lable_local);    
        
        var annotation = Titanium.Map.createAnnotation({
            latitude: region.geoResult.point.lat,
            longitude: region.geoResult.point.lng,
            title: region.name.replace('Pluviômetros (Alerta-Rio) -  ', ''),
            subtitle: subtitle,
            image: image,
            animate:true,
            leftView: rview,
            myid:i+1 // Custom property to uniquely identify this annotation.
        }); 
        
        lable_local.annotation = annotation;
        
        return annotation;
	};
	   
	get_info_and_run(self, create_map_annotation, function(points) {
	    self.addAnnotations(points);
	});

    Titanium.App.addEventListener('sync_information', function(data) {
        Titanium.API.info('Timer run!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        
        //chuva e alagamento
        if (data && data.is_raining) { //somente chuva
            if (!raining) {
                //****************************************
                var intent = Titanium.Android.createIntent({
                    action: Titanium.Android.ACTION_MAIN,
                    url : 'app.js',
                    flags : Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
                });  
                intent.addCategory(Titanium.Android.CATEGORY_LAUNCHER);
                 
                var pending = Titanium.Android.createPendingIntent({
                    activity: Ti.Android.currentActivity,
                    intent: intent,
                    type: Titanium.Android.PENDING_INTENT_FOR_ACTIVITY, 
                    flags: Titanium.Android.FLAG_ACTIVITY_NEW_TASK,
                    icon: '/images/day-lightcloud-rain-icon.png'
                });
                 
                var notification = Titanium.Android.createNotification({
                    contentIntent: pending,
                    contentTitle: data.is_raining.meta.info,
                    contentText: "Chovendo em " + data.is_raining.name,
                    tickerText: "Alerta de Chuva!",
                    when: new Date().getTime(),
                    icon: '/images/day-lightcloud-rain-icon.png',
                    flags : Titanium.Android.ACTION_DEFAULT | Titanium.Android.FLAG_AUTO_CANCEL | Titanium.Android.FLAG_SHOW_LIGHTS
                });
                
                Ti.Android.NotificationManager.notify(1, notification);
                //****************************************
                raining = true;
            }
        } else {
            raining = false;
        }
        
    });
    
    self.addEventListener("click", function(e){
    	if (e.clicksource == "pin") {
    		var position = {
    			latitude: e.annotation.latitude,
    			longitude: e.annotation.longitude
    		}
    		self.setMapCenter(position);
    	}
    });
    
        
    var pref = get_pref();
    if (pref == null) {
        save_pref(initial_preferences);
    } else {
        //preferences['my_place']['latitude'] = e.source.latitude;
        //preferences['my_place']['longitude'] = e.source.longitude;
        if (pref['my_place'] != null){ 
	        var position = {
	            latitude: pref['my_place']['latitude'],
	            longitude: pref['my_place']['longitude']
	        }
	        self.setMapCenter(position);
	    }    
    }
    
    
    
    var intent = Titanium.Android.createServiceIntent({
        url: SYNC_SERVICE_URL
    });
    
    intent.putExtra('interval', 60 * 1000);
    Titanium.Android.startService(intent);
	
	return self;
}

module.exports = MapView;