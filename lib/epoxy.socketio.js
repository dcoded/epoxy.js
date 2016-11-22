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