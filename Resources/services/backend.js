var save_object = function(model_name, id, object) {
    var newDir = Titanium.Filesystem.getFile(
        Titanium.Filesystem.applicationDataDirectory, 
        model_name
    );
    
    if (!newDir.exists()) {
        newDir.createDirectory();
    }
    
    var file = Titanium.Filesystem.getFile(newDir.nativePath, id + '.json');
    Ti.API.debug('Saving on for: '+ file.nativePath);
    file.write(JSON.stringify(object));
};

var get_object = function(model_name, id) {
    var newDir = Titanium.Filesystem.getFile(
        Titanium.Filesystem.applicationDataDirectory, 
        model_name
    );
    if (!newDir.exists()) {
        newDir.createDirectory();
    }
    var file = Titanium.Filesystem.getFile(newDir.nativePath, id + '.json');
    Ti.API.debug('Relying on local- storage: '+ file.nativePath);
    if (file.exists()) {
        return eval('(' + file.read().text + ')');
    }
    return null;
};

var save_pref = function(data) {
    save_object("preferences", "global", data);
}

var get_pref = function(data) {
    return get_object("preferences", "global");
}


var get_info_and_run = function(map, process_region, process_points) {
    var HttpClient = require('services/HttpClient');
    var auth_request = new HttpClient('GET', AUTH_URL);
    
    auth_request.onload = function(response) {
        var token = this.getResponseHeader("X-Access-Token");
        var rain_request = new HttpClient('GET', RAIN_URL, token);
        rain_request.onload = function(e) {
            var json = eval('(' + this.getResponseText() + ')');
            var points = [];
            for (var i = 0; i < json.results.length; i++) {
                var region = json.results[i];
                var temp = process_region(i, region);
                if (temp != null) {
                    points.push(temp);
                }
            }
            process_points(points);
        }
        rain_request.send(); 
    }
    
    auth_request.onerror = function(response) {
        alert("Não foi possível acessar o servidor");
    }
    
    auth_request.send();
};
