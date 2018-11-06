	/*Time stuff*/

	function startTime() {
	    var today = new Date();
	    var h = today.getHours();
	    var m = today.getMinutes();
	    var s = today.getSeconds();
	    var ampm = "AM";
	    m = checkTime(m);
	    s = checkTime(s);
	    if(h>12){
	    	ampm = "PM";
	    	h = h -12;
	    } else {
	    	if(h == 12){
	    		ampm = "PM";
	    	} else {
	    	ampm = "AM";
	    	}
		}
	    document.getElementById('timeData').innerHTML =
	    [[h , m , s].join(":"), ampm].join(" ");
	    var t = setTimeout(startTime, 500);
	}
	function checkTime(i) {
	    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
	    return i;
	}


	/*Weather stuff*/
/*
	var getLocation = function() {
   		if (navigator.geolocation) {
       		navigator.geolocation.getCurrentPosition(createAPI);
   		} else {
       		getElementById('weatherData').innerHTML = "Geolocation is not supported by this browser.";
   		}
	};
*/
	var ur = "";
	var createAPI = function(/*position*/) {
	 		/*ur = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
 			ur = ur + "&APPID=d6c57b984aadbe13da26411370bd23c5";*/
 			ur = "https://api.openweathermap.org/data/2.5/weather?q=Lahore&appid=d6c57b984aadbe13da26411370bd23c5";
 			var json = undefined;
 
 		$.ajax({
 			dataType: "json",
  			url: ur,
 			data: function(data) {
 			},
  			success: function(success) {
   				json = success;
   				var temp = (json.main.temp - 273.15).toFixed(2);
   				document.getElementById('weatherData').innerHTML =
   				json.weather[0].main + "."+ "<br />"
   				 + temp + "C";
 			}
		});
	};
	createAPI();
	/*getLocation();*/
