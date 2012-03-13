//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var MapView = require('ui/MapView');
		
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff',
		navBarHidden:true,
		exitOnClose:true
	});
		
	//construct UI
	var mapView = new MapView();
	self.add(mapView);
	
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
