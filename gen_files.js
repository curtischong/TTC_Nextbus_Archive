var request = require('request');
var fs = require('fs');
//routename
//routestops: stopid~stopcode~stoptitle~stoplat~stoplon
request('http://restbus.info/api/agencies/ttc/routes', function (error, response, res) {
  var theResponse = JSON.parse(res);
  theResponse.forEach(function(element){
    request('http://restbus.info/api/agencies/ttc/routes/'+element.id, function (error, response, rese) {
      var parseResponse = JSON.parse(rese);
      fs.writeFile(element.id+".txt", element.title+"\n", function(err) {
        parseResponse.stops.forEach(function(stop){
          fs.appendFile(element.id+'.txt',stop.id+"~"+stop.code+"~"+stop.title+"~"+stop.lat+"~"+stop.lon+"~");
        });
      });
    });
  });
});
