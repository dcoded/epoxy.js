# Epoxy.JS
The focus of this simple library is to provide the ability to track changes to attributes, DOM node properties, and element contents without hiding too much complexity or using  excessing custom calls.

## Getting Started

### Installation

The files in the **lib/** directory can be used standalone of any external dependency.  If you wish to view the kitchensink stuff you can run

```
git clone https://github.com/dcoded/epoxy.js
cd epoxy.js
npm install
npm test
```

A test server should be running at [http://localhost:3000/](http://localhost:3000/)

### Enable binding of an element
This libary attempts to be unintrusive with existing HTML templates. To enable binding of a DOM element only an addition of a `data-id` attribute is required.

Original | Epoxy binded
------ | ---------------------
```<input type="text" />``` | ```<input type="text" data-id="foo" />```
```<a href="#">...</a>``` | ```<a href="#" data-id="bar">...</a>```


### Initialize library

Developers have control over when Epoxy.js is initialized and is not dependent on source code location or DOM initialization state. Somewhere on the page the initialization function needs to be called.

```
// Load Epoxy.JS and create bindings
Epoxy.initialize();
``` 

### Create a basic Binder
TODO


### Add an event listener
An event is currently limited to DOM events (click, mouseover, keydown, ...) and is propigated by a Binder object.

```
Epoxy.addListener(function(id, attr, value) {
    // if any click enabled binded event triggers then update
    if (attr == 'event:click') {
        var first = Data.getValue('firstname', 'value');
        var last  = Data.getValue('lastname', 'value');
        Data.setValue('foobar', 'innerText', 'Hello my name is ' + first + ', ' + last);
    }
});
```


#### Create a Socket.IO listener to sync between client and server

Here is an example of integrating Socket.IO into Epoxy.js to sync in real time. This could work with other libraries just as easily.


**Client-side**

```
var EpoxySocketIO = function(url) {

    var CHANNEL = 'epoxy.js';
    var socket  = io(url);

    return function(id, binder, value) {
        console.log('EpoxySocketIO: listener');

        socket.emit(CHANNEL, {
            id : id,
            binder: binder,
            value: value
        });

        socket.on(CHANNEL, function(data) {
            Epoxy.setValue(data.id, data.value);
        });
    };
};
```

**Server-side**

```
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
```
