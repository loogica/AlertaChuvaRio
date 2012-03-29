//MapView Component Constructor
function MapView() {
	APP_ID = "40ca7235f9510dc0f2f5712093ded3bf";
    APP_SECRET = "gmo2d-hka0e-2vs6q";
    
    AUTH_URL = "http://api.riodatamine.com.br/rest/request-token?" +
               "app-id=" + APP_ID + "&app-secret=" + APP_SECRET;
    RAIN_URL = "http://api.riodatamine.com.br/" +
        "rest/meteorologia/pluviometros?format=json";
        
    Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	
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
	
	self.getLocation = function(){
		//Get the current position and set it to the mapview
		Titanium.Geolocation.getCurrentPosition(function(e){
			if (e.error){
				Ti.API.log('error: ' + JSON.stringify(e.error) );
				alert('consertar localizacao no emulador');
            	return;
			}
			else{
		        var region = {
		            latitude: e.coords.latitude,
		            longitude: e.coords.longitude,
		            animate: true,
		            latitudeDelta: 0.35,
		            longitudeDelta: 0.35
		        };
		        self.setLocation(region);
		  }
		});
	}
    
	Ti.API.debug(AUTH_URL);
	
	var HttpClient = require('services/HttpClient');
	var request = new HttpClient('GET', AUTH_URL);
	
	request.onload = function(response) {
	    token = this.getResponseHeader("X-Access-Token");
	    
	    req2 = new HttpClient('GET', RAIN_URL, token);

        req2.onload = function(e) {
            json = eval('(' + this.getResponseText() + ')');
            
            points = [];
            
            for (var i = 0; i < json.results.length; i++) {
                
                var r = json.results[i];
                
                var image = "";
                if (r.ilustration.icon == "http://riomidia.cor.rio.gov.br/camadas/pluviometros/_sem_chuva_nuvem.png") {
                	image = '../images/greenrain.png';
                }
                else{
                	image = '../images/redrain.png';
                };
                
                var history_pattern = /[0-9]*.[0-9]* mm/g;
                var history = r.description.text.match(history_pattern);
                var history_text = "1h: " + history[1] + ' | 4hs: ' + history[2] + '\n24hs: ' + history[3] + ' | 96hs ' + history[4];
                
                var situation_pattern = /Situação em [0-9]*\/[0-9]*\/[0-9]* - [0-9]*:[0-9]*/gi;
                var situation = r.description.text.match(situation_pattern);
                
                var subtitle = r.taxonomies[0].value + " (" + situation + ")" + '\n' + history_text;
                
                var annotation = Titanium.Map.createAnnotation({
                    latitude: r.geoResult.point.lat,
                    longitude: r.geoResult.point.lng,
                    title: r.name.replace('Pluviômetros (Alerta-Rio) -  ', ''),
                    subtitle: subtitle,
                    image: image,
                    animate:true,
                    rightButton: '../images/appcelerator_small.png',
                    myid:i+1 // Custom property to uniquely identify this annotation.
                }); 
                
                points.push(annotation);
            }
            
            self.addAnnotations(points);
            
        }
        
        req2.send();
    	    
	}
	
	request.onerror = function(response) {
	    alert(this);
	}
	
	request.send();
	
	return self;
}

module.exports = MapView;