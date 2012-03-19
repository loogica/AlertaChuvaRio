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
		exitOnClose:true,
		backgroundImage:'/images/back.png'
	});
	self.orientationModes = [Ti.UI.PORTRAIT];
	
	//home action bar
	var actionBar = new ActionBarView({
		buttons: {
			eu: {
				title:'Eu',
				width:40
			},
			settings: {
				icon:'/images/14-gear@2x.png',
				width:40
			}
		}
	});
	self.add(actionBar.viewProxy);
	
	var mapView = new MapView();
	self.add(mapView);
	
	/*
	//main tab control
		var tabs = new TabStripView({
			viewArgs: {
				top:44
			},
			tabs: {
				stream: {
					title:L('updates', 'Stream'),
					icon:'/images/tabs/chat_white.png'
				},
				groups: {
					title:L('groups', 'Groups'),
					icon:'/images/tabs/group_white.png'
				},
				events: {
					title:L('events', 'Events'),
					icon:'/images/tabs/calendar_white.png'
				},
				leaders: {
					title:L('leaders', 'Leaders'),
					icon:'/images/tabs/badge_white.png'
				}
			}
		});
		self.add(tabs.viewProxy);
		
		//create main app views
		var stream = new StreamView(), 
			groups = new GroupsView(), 
			events = new EventsView(), 
			leaders = new LeadersView();
		
		var scroller = Ti.UI.createScrollableView({
			top:100,
			left:0,
			right:0,
			bottom:0,
			views:[stream, groups, events, leaders],
			showPagingControl:false
		});
		self.add(scroller);
		
		scroller.addEventListener('scroll', function(e) {
			tabs.selectIndex(e.currentPage);
		});
		
		
		tabs.addEventListener('selected', function(e) {
			scroller.scrollToView(e.index);
		});*/
	
	
	actionBar.addEventListener('buttonPress', function(e) {
		if (e.id == 'eu') {
			mapView.getLocation();
		}
	});
	
	return self;
}

module.exports = AppWindow;