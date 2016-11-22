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

var Epoxy = (function() {

    var DATA_ATTRIBUTE = 'data-id';
    var bindOperatorArray = [];
    var bindListenerArray = [];

    var EventCallback = function(operator, node) {
        bindListenerArray.forEach(function(fn) {
            var id    = node.getAttribute(DATA_ATTRIBUTE);
            var attr  = operator.attribute;
            var value;
            
            if (operator.getValue instanceof Function) {
                value = operator.getValue(node);
            }

            fn(id, attr, value);
        });
    };

    var MatchAnySelector = function(node, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (node.matches(arr[i])) {
                return true;
            }
        }
        return false;
    };

    var Bind = function(node) {
        if (node instanceof HTMLElement && node.getAttribute(DATA_ATTRIBUTE)) {
            bindOperatorArray.forEach(function(operator) {
                if (MatchAnySelector(node, operator.selectors) &&
                    operator.bind instanceof Function) {
                    operator.bind(node, EventCallback.bind(this, operator, node));
                }
            });
        }
    };

    var Unbind = function(node) {
        if (node instanceof HTMLElement && node.getAttribute(DATA_ATTRIBUTE)) {
            bindOperatorArray.forEach(function(operator) {
                if (MatchAnySelector(node, operator.selectors) &&
                    operator.unbind instanceof Function) {
                    operator.unbind(node, EventCallback.bind(this, operator, node));
                }
            });
        }
    };

    var NodeOfDataAttributeValue = function(id) {
        var attr = '[' + DATA_ATTRIBUTE + '=' + id + ']';
        var node = document.querySelector(attr);
        return node;
    };

    return {

        initialize: function() {
            var nodes;
            nodes = document.querySelectorAll('[' + DATA_ATTRIBUTE + ']');
            nodes = Array.from(nodes);
            nodes.forEach(Bind);


            var documentObserver = new MutationObserver(function(mutations, observer) {
                mutations.forEach(function(mutation) {
                    var created = Array.from(mutation.addedNodes);
                    var removed = Array.from(mutation.removedNodes);

                    created.forEach(Bind);
                    removed.forEach(Unbind);
                });
            });

            //  Define what element should be observed by the observer
            //  and what types of mutations trigger the callback
            documentObserver.observe(document, {
            //  Set to true if additions and removals of
            //  the target node's child elements
            //  (including text nodes) are to be observed.
                childList            : true,
                
            //  Set to true if mutations to target's
            //  attributes are to be observed.
                attributes           : false,

            //  Set to true if mutations to target's
            //  data are to be observed.
                characterData        : false,

            //  Set to true if mutations to target and
            //  target's descendants are to be observed.
                subtree              : true,

            //  Set to true if attributes is set to true
            //  and target's attribute value before the
            //  mutation needs to be recorded.
                attributeOldValue    : false,

            //  Set to true if characterData is set to
            //  true and target's data before the
            //  mutation needs to be recorded.
                characterDataOldValue: false,

            //  Set to an array of attribute local names
            //  (without namespace) if not all attribute
            //  mutations need to be observed.
                attributeFilter      : undefined
            });
        },

        bind  : Bind,
        unbind: Unbind,

        getValue: function(id, attr) {
            var node = NodeOfDataAttributeValue(id);
            for (var i = 0; i < bindOperatorArray.length; i++) {
                var operator = bindOperatorArray[i];
                if (operator.attribute == attr &&
                    operator.getValue instanceof Function) {
                    return operator.getValue(node);
                }
            }

            return undefined;
        },

        setValue: function(id, attr, value) {
            var node = NodeOfDataAttributeValue(id);
            for (var i = 0; i < bindOperatorArray.length; i++) {
                var operator = bindOperatorArray[i];
                if (operator.attribute == attr &&
                    operator.setValue instanceof Function) {
                    operator.setValue(node, value);
                }
            }
        },

        addBinder: function(object) {
            if (object           instanceof Object      &&
                object.selectors instanceof Array       &&
                typeof object.attribute === "string") {
                bindOperatorArray.push(object);
            }
        },

        addListener: function(fn) {
            bindListenerArray.push(fn);
        },

        removeListener: function(fn) {
            var index = bindListenerArray.indexOf(fn);
            if (index !== -1) {
                bindListenerArray.splice(index, 1);
            }
        }
    };

})();