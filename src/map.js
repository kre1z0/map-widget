import fetchJsonp from 'fetch-jsonp';
import mustache from 'mustache';
import { init } from 'sGis/dist/init.js';
import { TileLayer } from 'sGis/dist/layers/TileLayer.js';
import { FeatureLayer } from 'sGis/dist/layers/FeatureLayer.js';
import { PointFeature } from 'sGis/dist/features/PointFeature.js';
import { BalloonControl } from 'sGis/dist/controls/BalloonControl.js';
import { Point } from 'sGis/dist/Point.js';

import { popupTemplate } from './popup-template';
import styles from './styles.css';

const apiUrl = 'https://msp.everpoint.ru/';

class Map {
    constructor() {
        this.init();
    }

    fetchData() {
        return fetchJsonp(`${apiUrl}static/fair.jsonp`, {
            jsonpCallbackFunction: 'callback',
        })
            .then(res => res.json())
            .then(json => json)
            .catch(ex => console.log('Error', ex))
    }

    init() {
        this.fetchData().then(data => {
            //console.log('--> data',data);
            console.log('--> features', data.features.features);
            //console.log('--> popup', mustache.render(popup, view));
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
                wrapper: styles.mapContainer,
                layers: [new TileLayer('http://b.tile.openstreetmap.org/{z}/{x}/{y}.png')],
                centerPoint: new Point([57.84, 40.56]),
                resolution: 2445.984905125002
            });

            let control = new BalloonControl(map, { painter });
            let featureLayer = new FeatureLayer();

            data.features.features.forEach(({ geometry, properties }) => {
                const view = {
                    message: 'Hello world!!!',
                };
                const popup = mustache.render(popupTemplate, view);
                console.log('--> popup', popup);
                let feature = new PointFeature(geometry.coordinates);
                control.attach(feature, `<div class="${styles.popup}">${popup}</div>`);
                featureLayer.add(feature);
            });

            map.addLayer(featureLayer);
        });
    }
}

export default Map;
