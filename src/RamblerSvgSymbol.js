import { DynamicPointSymbol } from 'sGis/dist/symbols/Symbol.js';

class RamblerSvgSymbol extends DynamicPointSymbol {
    getNode(feature) {
        console.log('--> feature', feature);
        //let labelFeature = <LabelFeature>feature;

        let node = document.createElement('span');
        node.innerText = labelFeature.content;
        if (this.cssClassName) node.className = this.cssClassName;

        return node;
    }
}

export default RamblerSvgSymbol;
