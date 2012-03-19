//MapView Component Constructor
function MapView() {
	APP_ID = "";
    APP_SECRET = "";    
    AUTH_URL = "http://api.riodatamine.com.br/rest/request-token?" +
               "app-id=" + APP_ID + "&app-secret=" + APP_SECRET;
    RAIN_URL = "http://api.riodatamine.com.br/" +
        "rest/meteorologia/pluviometros?format=json";
	
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
                
                var pin_image = "";
                if (r.ilustration.icon == "http://riomidia.cor.rio.gov.br/camadas/pluviometros/_sem_chuva_nuvem.png") {
                	pin_image = Titanium.Map.ANNOTATION_GREEN;
                }
                else{
                	pin_image = Titanium.Map.ANNOTATION_RED;
                };
                
                var annotation = Titanium.Map.createAnnotation({
                    latitude: r.geoResult.point.lat,
                    longitude: r.geoResult.point.lng,
                    title: r.name,
                    subtitle: r.taxonomies[0].value,
                    pincolor: pin_image,
                    animate:true,
                    leftButton: '../images/appcelerator_small.png',
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