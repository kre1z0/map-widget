import "@babel/polyfill";
import mustache from "mustache";
import { popup } from "./popup-template";
const view = {
  message: "Hello world!!!"
};

/**
 * start app function
 * @param {dom-node} domNode
 */
export function startApp(domNode) {
  if (!domNode) {
    throw Error('start app need dom node')
  }

  domNode.innerHTML = mustache.render(popup, view)
}