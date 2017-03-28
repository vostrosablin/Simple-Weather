var express = require('express');
var io = require('socket.io');

var app = module.exports = express.createServer();
var io = io.listen(app);
var NodeGeocoder = require('node-geocoder');
// Configuration

var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  //apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
var geocoder = NodeGeocoder(options);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res){
  res.render('index');
});

app.listen(3000);
console.log("Server server started on port %d ", app.address().port);

io.sockets.on('connection', function(socket){

var location='';

 socket.on('loc1', function(data){
   geocoder.reverse({lat:data.lat, lon:data.long}, function(err, res) {
   var obj = JSON.parse(JSON.stringify(res[0]));
   var location = obj.city + ","+" " + obj.country;
   socket.emit('loc2', location)
   });
  })

socket.on('weather1', function(data){
  socket.emit('descr', data.weather[0].description);
  socket.emit('temp', data.main.temp);
  socket.emit('id', data.weather[0].id.toString().charAt(0));
})

})
