
var KeyboardEventBindings = {
    bind: function(node, eventCallback) {
        node.addEventListener('keydown'     , eventCallback);
        node.addEventListener('keyup'       , eventCallback);
        node.addEventListener('keypress'    , eventCallback);
    },

    unbind: function(node, eventCallback) {
        node.removeEventListener('keydown'  , eventCallback);
        node.removeEventListener('keyup'    , eventCallback);
        node.removeEventListener('keypress' , eventCallback);
    }
};

var ClickEventBindings = {
    bind: function(node, eventCallback) {
        node.addEventListener('click', eventCallback);
    },

    unbind: function(node, eventCallback) {
        node.removeEventListener('click', eventCallback);
    }
};

var TagAttributeAccessor = {
    getValue: function(attr) {
        return function(node) {
            return node.getAttribute(attr);
        };
    },

    setValue: function(attr) {
        return function(node, value) {
            node.setAttribute('href', value);
        };
    }
};

var PropertyAccessor = {
    getValue: function(property) {
        return function(node) {
            return node[property];
        };
    },

    setValue: function(property) {
        return function(node, value) {
            node[property] = value;
        };
    }
};


Data.addBinder({

    attribute: 'href',
    selectors: ['a'],

    bind  : ClickEventBindings.bind,
    unbind: ClickEventBindings.unbind,

    getValue: TagAttributeAccessor.getValue('href'),
    setValue: TagAttributeAccessor.setValue('href')

});

Data.addBinder({

    attribute: 'event:click',
    selectors: [
        'a',
        'input[type=submit]',
        'button'
    ],

    bind  : ClickEventBindings.bind,
    unbind: ClickEventBindings.unbind,
});

Data.addBinder({

    attribute: 'value',
    selectors: [
        'input[type=text]',
        'input[type=password]',
        'textarea'
    ],

    bind  : KeyboardEventBindings.bind,
    unbind: KeyboardEventBindings.unbind,

    getValue: PropertyAccessor.getValue('value'),
    setValue: PropertyAccessor.setValue('value')

});

Data.addBinder({

    attribute: 'innerText',
    selectors: ['*'],

    getValue: PropertyAccessor.getValue('innerText'),
    setValue: PropertyAccessor.setValue('innerText')

});