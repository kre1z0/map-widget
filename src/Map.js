import fetchJsonp from 'fetch-jsonp';
import mustache from 'mustache';
import { init } from 'sGis/dist/init';
import { TileLayer } from 'sGis/dist/layers/TileLayer';
import { FeatureLayer } from 'sGis/dist/layers/FeatureLayer';
import { PointFeature } from 'sGis/dist/features/PointFeature';
import { Point } from 'sGis/dist/Point';
import { wgs84 } from 'sGis/dist/Crs';

import yarmarkaIcon from './icons/Yarmarka.svg';
import yarmarkaIconSelected from './icons/Yarmarka_selected.svg';
import { popupTemplate } from './templates/popup-template';
import { zoomPanelTemplate } from './templates/zoom-plugin-template';
import { errorTemplate } from './templates/error-template';
import { RamblerSymbol } from './RamblerSymbol';
import styles from './styles.css';

const apiUrl = 'https://msp.everpoint.ru/';

class Map {
    constructor() {
        this.init();
        this.mapWrapperId = styles.mapContainer;
        this.selectedObject = {};
    }

    fetchData() {
        return fetchJsonp(`${apiUrl}static/fair.jsonp`, {
            jsonpCallbackFunction: 'callback',
        })
            .then(res => res.json())
            .then(json => json)
            .catch(ex => {
                const wrapper = document.createElement('div');
                const map = document.getElementById(this.mapWrapperId);
                const error = mustache.render(errorTemplate, { errorText: ex });
                wrapper.innerHTML = `${error}`;
                if (map) {
                    map.appendChild(wrapper);
                }
            });
    }

    onMapClick(e) {
        const targetClassName = e.target.className;
        if (typeof targetClassName === 'string' || targetClassName instanceof String) {
            const closeBtnClicked = targetClassName.includes(styles.closeBtn);
            if (closeBtnClicked) {
                const popup = document.querySelector(`.${styles.popup}`);
                popup.classList.add(styles.fadeOut);
                setTimeout(() => {
                    popup.remove();
                }, 200);
            }
        }
    }

    clearSelection() {
        if (this.selectedFeature) {
            this.selectedFeature.clearTempSymbol();
            this.selectedFeature.__dynamicSymbolRender = null;
            this._layer.redraw();
        }
    }

    setSelection(feature) {
        this.selectedFeature = feature;
        this.selectedFeature.__dynamicSymbolRender = null;
        feature.setTempSymbol(this._selectedSymbol);
        this._layer.redraw();
    }

    onFeatureClick(props, feature) {
        const { id } = this.selectedObject;
        const map = document.getElementById(this.mapWrapperId);

        if (map && id !== props.id) {
            this.clearSelection();
            const prevPopup = document.querySelector(`.${styles.popup}`);
            if (prevPopup) prevPopup.remove();

            const popup = mustache.render(popupTemplate, props);
            const wrapper = document.createElement('div');

            wrapper.innerHTML = popup;
            wrapper.classList.add(styles.popup);

            map.appendChild(wrapper);

            if (prevPopup) {
                const popupContent = document.querySelector(`.${styles.popupContent}`);

                popupContent.classList.add(styles.fadeIn);
            } else {
                wrapper.classList.add(styles.fadeIn);
            }
            this.setSelection(feature);
        }

        this.selectedObject = {
            id: props.id,
        };
    }

    onZoom(value) {
        this.map.zoom(value);
    }

    initZoomPlugin() {
        const map = document.getElementById(this.mapWrapperId);
        const wrapper = document.createElement('div');
        const zoomPanel = mustache.render(zoomPanelTemplate);
        if (map) {
            wrapper.classList.add(styles.zoomPanel);
            wrapper.innerHTML = zoomPanel;
            map.appendChild(wrapper);
            const zoomIn = document.querySelector(`.${styles.zoomIn}`);
            const zoomOut = document.querySelector(`.${styles.zoomOut}`);
            zoomIn.addEventListener('click', () => this.onZoom(1));
            zoomOut.addEventListener('click', () => this.onZoom(-1));
        }
    }

    init() {
        this.fetchData().then(data => {
            let { map } = init({
                wrapper: styles.mapContainer,
                layers: [new TileLayer('http://tile1.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=40')],
                centerPoint: new Point([57.84, 40.56]),
                resolution: 2445.984905125002,
            });

            this.map = map;

            document.addEventListener('click', this.onMapClick.bind(this));

            let featureLayer = new FeatureLayer();

            let symbol = new RamblerSymbol(yarmarkaIcon);
            this._selectedSymbol = new RamblerSymbol(yarmarkaIconSelected);

            data.features.features.forEach(({ geometry, id, properties }) => {
                const props = {
                    id,
                    name: properties.name,
                    assortmentOfgoods: properties.fields[1].value,
                    address: properties.address,
                    periodicity: properties.fields[0].value,
                };

                let feature = new PointFeature(geometry.coordinates, {
                    symbol,
                    crs: wgs84,
                });

                feature.on('click', () => this.onFeatureClick(props, feature));

                featureLayer.add(feature);
            });

            map.addLayer(featureLayer);

            this._layer = featureLayer;
            this.initZoomPlugin();
        });
    }
}

export default Map;
