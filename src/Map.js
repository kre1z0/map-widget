import fetchJsonp from 'fetch-jsonp';
import mustache from 'mustache';
import { init } from 'sGis/dist/init.js';
import { TileLayer } from 'sGis/dist/layers/TileLayer.js';
import { FeatureLayer } from 'sGis/dist/layers/FeatureLayer.js';
import { PointFeature } from 'sGis/dist/features/PointFeature.js';
import { BalloonControl } from 'sGis/dist/controls/BalloonControl.js';
import { Point } from 'sGis/dist/Point.js';
import { Crs, wgs84 } from 'sGis/dist/Crs.js';

import RamblerSvgSymbol from './RamblerSvgSymbol';
import { popupTemplate } from './popup-template';
import styles from './styles.css';

const apiUrl = 'https://msp.everpoint.ru/';

class Map {
    constructor() {
        this.init();
        this.mapWrapperId = styles.mapContainer;
        this.selectedObjectId = null;
    }

    fetchData() {
        return fetchJsonp(`${apiUrl}static/fair.jsonp`, {
            jsonpCallbackFunction: 'callback',
        })
            .then(res => res.json())
            .then(json => json)
            .catch(ex => console.log('Error', ex));
    }

    onMapClick(e) {
        const closeBtnClicked = e.target.className.includes(styles.closeBtn);
        if (closeBtnClicked) {
            const popup = document.querySelector(`.${styles.popup}`);
            popup.remove();
        }
    }

    onFeatureClick(props) {
        const map = document.getElementById(this.mapWrapperId);
        if (map && this.selectedObjectId !== props.id) {
            const prevPopup = document.querySelector(`.${styles.popup}`);
            if (prevPopup) prevPopup.remove();

            const popup = mustache.render(popupTemplate, props);
            const wrapper = document.createElement('div');
            wrapper.innerHTML = popup;
            wrapper.classList.add(styles.popup);
            map.appendChild(wrapper);
        }
        this.selectedObjectId = props.id;
        console.log('--> this.selectedObjectId ', this.selectedObjectId, props);
    }

    init() {
        this.fetchData().then(data => {
            console.log('--> features', data.features.features);
            //const sym = new RamblerSvgSymbol([0, 0]);
            //console.log('--> RamblerSvgSymbol', sym);
            let points = [
                {
                    position: [55.7514, 37.6409],
                    text: 'Moscow',
                    link:
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/MSK_Collage_2015.png/343px-MSK_Collage_2015.png',
                },
                {
                    position: [59.9226, 30.3324],
                    text: 'Saint Petersburg',
                    link:
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/St._Petersburg_Montage_2016.png/343px-St._Petersburg_Montage_2016.png',
                },
            ];

            let { map, painter } = init({
                wrapper: styles.mapContainer,
                layers: [new TileLayer('http://b.tile.openstreetmap.org/{z}/{x}/{y}.png')],
                centerPoint: new Point([57.84, 40.56]),
                resolution: 2445.984905125002,
            });

            document.addEventListener('click', this.onMapClick);

            let control = new BalloonControl(map, { painter });
            let featureLayer = new FeatureLayer();

            //const symbol = new Symbol(
            //    new sGis.symbol.point.Point({
            //        fillColor: 'white',
            //        size: 32,
            //        strokeColor: 'rgba(0,255,255,0.5)',
            //        strokeWidth: 5,
            //    }),
            //    new sGis.symbol.label.Label({
            //        css: 'sGis-symbol-label-center-middle customLabelClass',
            //    }),
            //);

            const sym = RamblerSvgSymbol([0, 0]);
            console.log('--> sym', sym);

            data.features.features.forEach(({ geometry, id, properties }) => {
                const props = {
                    id,
                    name: properties.name,
                    assortmentOfgoods: properties.fields[1].value,
                    address: properties.address,
                    periodicity: properties.fields[0].value,
                };
                //const popup = mustache.render(popupTemplate, props);

                let feature = new PointFeature(geometry.coordinates, {
                    //symbol: crossSymbol,
                    crs: wgs84,
                });
                feature.on('click', () => this.onFeatureClick(props));

                //control.attach(feature, `<div class="${styles.popup}">${popup}</div>`);
                featureLayer.add(feature);
            });

            map.addLayer(featureLayer);
        });
    }
}

export default Map;
