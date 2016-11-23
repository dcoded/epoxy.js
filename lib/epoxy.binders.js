/*!
 * Epoxy.js Library v0.1.0
 *
 * Copyright Denis Coady
 * Released under the MIT license
 * https://opensource.org/licenses/MIT
 *
 * Date: 2016-11-22T00:00Z
 */

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

var FormSubmitBindings = {
    bind: function(node, eventCallback) {
        node.addEventListener('submit',
            FormSubmitBindings.preventDefault.bind(null, eventCallback));
    },

    unbind: function(node, eventCallback) {
        node.removeEventListener('submit',
            FormSubmitBindings.preventDefault.bind(null, eventCallback));
    },

    preventDefault: function(eventCallback, event) {
        event.preventDefault();
        eventCallback(event);
    }
};

var ClickEventBindings = {
    bind: function(node, eventCallback) {
        node.addEventListener('click',
            ClickEventBindings.preventDefault.bind(null, eventCallback));
    },

    unbind: function(node, eventCallback) {
        node.removeEventListener('click',
            ClickEventBindings.preventDefault.bind(null, eventCallback));
    },

    preventDefault: function(eventCallback, event) {
        event.preventDefault();
        eventCallback(event);
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


Epoxy.addBinder({
    attribute: 'attribute:href',
    selectors: ['a'],

    bind  : ClickEventBindings.bind,
    unbind: ClickEventBindings.unbind,

    getValue: TagAttributeAccessor.getValue('href'),
    setValue: TagAttributeAccessor.setValue('href')
});

Epoxy.addBinder({
    attribute: 'event:click',
    selectors: [
        'a',
        'input[type=submit]',
        'button'
    ],

    bind  : ClickEventBindings.bind,
    unbind: ClickEventBindings.unbind,
});

Epoxy.addBinder({
    attribute: 'property:value',
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

Epoxy.addBinder({
    attribute: 'event:submit',
    selectors: ['form'],

    bind  : FormSubmitBindings.bind,
    unbind: FormSubmitBindings.unbind
});

Epoxy.addBinder({
    attribute: 'property:innerText',
    selectors: ['*'],

    getValue: PropertyAccessor.getValue('innerText'),
    setValue: PropertyAccessor.setValue('innerText')
});