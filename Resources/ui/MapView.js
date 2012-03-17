//MapView Component Constructor
function MapView() {
	APP_ID = "40ca7235f9510dc0f2f5712093ded3bf";
    APP_SECRET = "gmo2d-hka0e-2vs6q";    
    AUTH_URL = "http://api.riodatamine.com.br/rest/request-token?" +
               "app-id=" + APP_ID + "&app-secret=" + APP_SECRET;
    RAIN_URL = "http://api.riodatamine.com.br/" +
        "rest/meteorologia/pluviometros?format=json";
	
	//create object instance, a parasitic subclass of Observable
	var self = Titanium.Map.createView({
	    mapType: Titanium.Map.STANDARD_TYPE,
	    region: {latitude:-22.977675726196445, longitude:-43.24390411376953, 
	            latitudeDelta:0.01, longitudeDelta:0.01},
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
                
                var mountainView = Titanium.Map.createAnnotation({
                    latitude: r.geoResult.point.lat,
                    longitude: r.geoResult.point.lng,
                    title: r.name,
                    subtitle: "fuckers",
                    pincolor:Titanium.Map.ANNOTATION_RED,
                    animate:true,
                    leftButton: '../images/appcelerator_small.png',
                    myid:i+1 // Custom property to uniquely identify this annotation.
                }); 
                
                points.push(mountainView);
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