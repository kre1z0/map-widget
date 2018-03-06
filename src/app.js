import '@babel/polyfill';
import 'whatwg-fetch';
import mustache from 'mustache';
import Map from './map';
import { popup } from './popup-template';

const view = {
    message: 'Hello world!!!',
};

/**
 * start app function
 * @param {dom-node} domNode
 */
export function startApp(domNode) {
    new Map();
    console.log('-->cho');
    if (!domNode) {
        throw Error('start app need dom node');
    }

    domNode.innerHTML = mustache.render(popup, view);
}
