var request = require('request');
var fs = require('fs');
//vehicleid~directionid~headingid~lat~lon
request('http://159.203.17.134:3535/agencies/ttc/routes', function (error, response, res) {
  var theResponse = JSON.parse(res);
  setInterval(function(){
    var itemsProcessed = 0;
    theResponse.forEach(function(element){
      request('http://159.203.17.134:3535/agencies/ttc/routes/'+element.id+'/vehicles', function (error, response, body) {
        itemsProcessed++;
        if (!error && response.statusCode == 200 && body != '[]' ) {
          var parsed = JSON.parse(body);
          fs.appendFile(element.id+'.txt',"\n"+new Date().valueOf());
          for(var a = 0 ; a < parsed.length;a++){
            fs.appendFile(element.id+'.txt',"~"+parsed[a].id+"~"+parsed[a].directionId+"~"+parsed[a].heading+"~"+parsed[a].lat+"~"+parsed[a].lon);
          }
      }
      //console.log(theResponse.length+" calls");
      //console.log(itemsProcessed + " calls executed");
    });
  });
  //every 2 minutes, we will pull NextBus' TTC data
}, 20000);
});
