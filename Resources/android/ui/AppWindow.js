function AppWindow() {
	//load dependencies
	var _ = require('/lib/underscore'),
		theme = require('/ui/theme'),
		ui = require('/ui/components'),
		ActionBarView = require('/ui/ActionBarView'),
		//TabStripView = require('/ui/TabStripView'),
		//StreamView = require('/ui/StreamView'),
		//GroupsView = require('/ui/GroupsView'),
		//LeadersView = require('/ui/LeadersView'),
		//EventsView = require('/ui/EventsView'),
		MapView = require('/ui/MapView');
	
	//create base proxy object
	var self = new ui.Window({
		navBarHidden:true,
		exitOnClose: true,
		backgroundImage:'/images/back.png'
	});
	self.orientationModes = [Ti.UI.PORTRAIT];
	
	//home action bar
	var actionBar = new ActionBarView({
		buttons: {
			eu: {
				icon:'/images/me.png',
				width:51,
				heigh:51
			}
		}
	});
	self.add(actionBar.viewProxy);
	
	var mapView = new MapView();
	self.add(mapView);
	
	//self.addEventListener('android:back', function (e) {
	//    self.hide();
	//});

	return self;
}

module.exports = AppWindow;