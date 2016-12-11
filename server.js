var request = require('request');
var fs = require('fs');

setInterval(function(){
  fs.appendFile('ttc_archive.txt', ',"'+(new Date).getTime()+'":[');
  request('http://restbus.info/api/agencies/ttc/routes', function (error, response, res) {
    var theResponse = JSON.parse(res);
    var first = true;
    var itemsProcessed = 0;
    theResponse.forEach(function(element){
      request('http://restbus.info/api/agencies/ttc/routes/'+element.id+'/vehicles', function (error, response, body) {
        itemsProcessed++;
        if (!error && response.statusCode == 200 && body != '[]' ) {
          var parsed = JSON.parse(body);
          for(var a = 0 ; a < parsed.length;a++){
            delete parsed[a].predictable;
            delete parsed[a]._links;
            delete parsed[a].leadingVehicleId;
            delete parsed[a].secsSinceReport;
          }
          console.log(parsed);
          if(first == true){
            fs.appendFile('ttc_archive.txt',JSON.stringify(parsed));
            first = false;
          }else{
            fs.appendFile('ttc_archive.txt',","+JSON.stringify(parsed));
          }
        }
        if(itemsProcessed == theResponse.length) {
          fs.appendFile('ttc_archive.txt',"]");
        }
        console.log(theResponse.length+" calls");
        console.log(itemsProcessed + " calls executed");
      });
    });
  });
  //every 2 minutes, we will pull NextBus' TTC data
}, 120000);
