function LogoWindow() {
	var theme = require('/ui/theme'),
		ui = require('/ui/components');
	
	var self = new ui.Window({
		barColor:theme.appcRed,
		titleImage:'/images/appc_white.png',
		backgroundImage:theme.windowBackground
	});
	
	var configButton = Ti.UI.createButton({
		image:'/images/14-gear.png'
	});
	self.rightNavButton = configButton;
	
	configButton.addEventListener('click', function() {
		var SettingsWindow = require('/ui/SettingsWindow');
		var w = new SettingsWindow();
		w.open();
	});
	
	return self;
}

module.exports = LogoWindow;