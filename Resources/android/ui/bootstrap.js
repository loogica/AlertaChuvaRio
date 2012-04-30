exports.launch = function() {
	Ti.include('/services/backend.js');
	var AppWindow = require('/ui/AppWindow');

	
	var app = new AppWindow();
	
	var activity = app.activity;
	activity.onCreateOptionsMenu = function(e){
		var menu = e.menu;
		var menuItem = menu.add({ title: "Limpar preferências" });
		menuItem.addEventListener("click", function(e) {
			clean_pref();
		});
	};
	
	app.open();
};