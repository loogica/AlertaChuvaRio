function HttpClient(method, url, token) {
	var self = Ti.Network.createHTTPClient();
	
    self.open(method, url);
    if (token) {
        self.setRequestHeader('Authorization', token);
    }
    return self;
    
}; 

//make constructor function the public component interface
module.exports = HttpClient;
