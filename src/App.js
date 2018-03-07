import '@babel/polyfill';
import 'es6-promise';
import mustache from 'mustache';
import Map from './map';
import { mapContainer } from './map-template';

(function() {
    var arr = [window.Element, window.CharacterData, window.DocumentType];
    var args = [];

    arr.forEach(function(item) {
        if (item) {
            args.push(item.prototype);
        }
    });

    // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
    (function(arr) {
        arr.forEach(function(item) {
            if (item.hasOwnProperty('remove')) {
                return;
            }
            Object.defineProperty(item, 'remove', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function remove() {
                    this.parentNode.removeChild(this);
                },
            });
        });
    })(args);
})();

/**
 * start app function
 * @param {dom-node} domNode
 */
export function startApp(domNode, options) {
    if (!domNode) {
        throw Error('start app need dom node');
    }
    domNode.innerHTML = mustache.render(mapContainer);
    new Map();
}
