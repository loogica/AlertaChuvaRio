var service = Ti.Android.currentService;
var intent = service.getIntent();


Ti.App.fireEvent('sync_information', null);

