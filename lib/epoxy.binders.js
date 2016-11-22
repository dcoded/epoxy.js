/*  Epoxy.js v0.1.0

    Copyright (c) 2016 Denis Coady

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.
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


Epoxy.addBinder({

    attribute: 'href',
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

Epoxy.addBinder({

    attribute: 'innerText',
    selectors: ['*'],

    getValue: PropertyAccessor.getValue('innerText'),
    setValue: PropertyAccessor.setValue('innerText')

});