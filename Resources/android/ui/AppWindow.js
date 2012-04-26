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
		exitOnClose:false,
		backgroundImage:'/images/back.png'
	});
	self.orientationModes = [Ti.UI.PORTRAIT];
	
	//home action bar
	var actionBar = new ActionBarView({
		buttons: {
			eu: {
				title:'Eu',
				width:40
			}
		}
	});
	self.add(actionBar.viewProxy);
	
	var mapView = new MapView();
	self.add(mapView);

	return self;
}

module.exports = AppWindow;