import '@babel/polyfill';
import 'es6-promise';
import mustache from 'mustache';
import Map from './map';
import { mapContainer } from './map-template';


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
