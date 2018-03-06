import '@babel/polyfill';
import 'es6-promise';
import mustache from 'mustache';
import Map from './map';
import { popup } from './popup-template';
import { mapContainer } from './map-template';

const view = {
    message: 'Hello world!!!',
};

/**
 * start app function
 * @param {dom-node} domNode
 */
export function startApp(domNode) {
    new Map();
    if (!domNode) {
        throw Error('start app need dom node');
    }

    domNode.innerHTML = mustache.render(popup, view);
    domNode.innerHTML = mustache.render(mapContainer);
}
