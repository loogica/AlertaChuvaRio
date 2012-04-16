APP_ID = "";
APP_SECRET = "";

AUTH_URL = "http://api.riodatamine.com.br/rest/request-token?" +
           "app-id=" + APP_ID + "&app-secret=" + APP_SECRET;
RAIN_URL = "http://api.riodatamine.com.br/" +
    "rest/meteorologia/pluviometros?format=json";
            
SYNC_SERVICE_URL = "background_task.js";
    
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;