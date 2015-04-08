var net = require('net');

var client = new net.Socket();

client.connect(8124, '10.83.16.33', function() {
    console.log('Connected');
});

client.on('data', function(data) {
    console.dir(data);
});

client.on('end', function() {
    console.log('disconnected from server');
});