//MapView Component Constructor
function MapView() {
	//create object instance, a parasitic subclass of Observable
	
	var mountainView = Titanium.Map.createAnnotation({
	    latitude:-22.977675726196445,
	    longitude:-43.24390411376953,
	    title:"Appcelerator Headquarters",
	    subtitle:'Mountain View, CA',
	    pincolor:Titanium.Map.ANNOTATION_RED,
	    animate:true,
	    leftButton: '../images/appcelerator_small.png',
	    myid:1 // Custom property to uniquely identify this annotation.
	});
	
	var self = Titanium.Map.createView({
	    mapType: Titanium.Map.STANDARD_TYPE,
	    region: {latitude:-22.977675726196445, longitude:-43.24390411376953, 
	            latitudeDelta:0.01, longitudeDelta:0.01},
	    animate:true,
	    regionFit:true,
	    userLocation:true,
	    annotations:[mountainView]
	});
	
	return self;
}

module.exports = MapView;