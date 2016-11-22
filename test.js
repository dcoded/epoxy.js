var express = require('express');
var app     = express();

app.use('/'   , express.static('test'));
app.use('/lib', express.static('lib'));

var server = app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


// 2: Setup websocket service
var io = require('socket.io')(server);
io.engine.ws = new (require('uws').Server)({
    noServer: true,
    perMessageDeflate: false
});


io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('epoxy.js', function(data) {

        if (data.value == 'World') {
            data.value = 'Land';
            client.emit('epoxy.js', data);
        }
        console.log(data);
    });

});