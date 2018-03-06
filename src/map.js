import fetchJsonp from 'fetch-jsonp';

import { init } from '../../sGis/dist/init.js';
import { TileLayer } from '../../sGis/dist/layers/TileLayer.js';
import { FeatureLayer } from '../../sGis/dist/layers/FeatureLayer.js';
import { PointFeature } from '../../sGis/dist/features/PointFeature.js';
import { BalloonControl } from '../../sGis/dist/controls/BalloonControl.js';
import { Point } from '../../sGis/dist/Point.js';

const apiUrl = 'https://msp.everpoint.ru/';

class Map {
    constructor() {
        this.init();
    }

    fetchData() {
        return fetchJsonp(`${apiUrl}static/fair.jsonp`, {
            jsonpCallback: 'cb'
        })
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            console.log('parsed json', json)
        }).catch(function(ex) {
            console.log('parsing failed', ex)
        })
    }

    init() {
        this.fetchData();
        let points = [
            {
                position: [55.7514, 37.6409],
                text: 'Moscow',
                link: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/MSK_Collage_2015.png/343px-MSK_Collage_2015.png'
            },
            {
                position: [59.9226, 30.3324],
                text: 'Saint Petersburg',
                link: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/St._Petersburg_Montage_2016.png/343px-St._Petersburg_Montage_2016.png'
            }
        ];
        let { map, painter } = init({
            wrapper: document.body,
            layers: [new TileLayer('http://b.tile.openstreetmap.org/{z}/{x}/{y}.png')],
            centerPoint: new Point([57.84, 40.56]),
            resolution: 2445.984905125002
        });
        let control = new BalloonControl(map, { painter });
        let featureLayer = new FeatureLayer();
        points.forEach(point => {
            let feature = new PointFeature(point.position);
            control.attach(feature, `<h1>${point.text}</h1><img src="${point.link}" />`);
            featureLayer.add(feature);
        });
        map.addLayer(featureLayer);
    }
}

export default Map;
