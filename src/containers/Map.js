import fetchJsonp from 'fetch-jsonp';
import mustache from 'mustache';
import { init } from 'sgis/dist/init';
import { TileLayer } from 'sgis/dist/layers/TileLayer';
import { FeatureLayer } from 'sgis/dist/layers/FeatureLayer';
import { PointFeature } from 'sgis/dist/features/PointFeature';
import { Point } from 'sgis/dist/Point';
import { wgs84 } from 'sgis/dist/Crs';

import yarmarkaIcon from '../icons/Yarmarka.svg';
import yarmarkaIconSelected from '../icons/Yarmarka_selected.svg';
import { zoomPanelTemplate } from '../templates/zoom-plugin-template';
import { errorTemplate } from '../templates/error-template';
import { licenseTepmlate } from '../templates/license-template';
import { RamblerSymbol } from '../components/RamblerSymbol';
import Popup from '../components/Popup';
import styles from '../styles.css';

const apiUrl = 'https://msp.everpoint.ru/';

class Map {
    constructor() {
        this.init();
        this.mapWrapperId = styles.mapContainer;
        this.mapNode = document.getElementById(this.mapWrapperId);
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
        if (this.mapNode) {
            this.clearSelection();

            const prevPopup = document.querySelector(`.${styles.popup}`);

            if (prevPopup) {
                this.mapNode.removeChild(prevPopup);
                this.popup = new Popup(this.mapNode, props, true, () =>
                    this.clearSelection(),
                ).renderPopup();
            } else {
                this.popup = new Popup(this.mapNode, props, false, () =>
                    this.clearSelection(),
                ).renderPopup();
            }
            this.setSelection(feature);
        }
    }

    onZoom(value) {
        this.map.zoom(value);
    }

    initZoomPlugin() {
        const wrapper = document.createElement('div');
        const zoomPanel = mustache.render(zoomPanelTemplate);
        if (this.mapNode) {
            wrapper.classList.add(styles.zoomPanel);
            wrapper.innerHTML = zoomPanel;
            this.mapNode.appendChild(wrapper);
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
                centerPoint: new Point([60, 92]),
                resolution: 9600,
            });
            map.maxResolution = 9601;

            const licenseWrapper = document.createElement('div');
            licenseWrapper.innerHTML = mustache.render(licenseTepmlate);
            this.mapNode.appendChild(licenseWrapper);

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

            this.map = map;
            this._layer = featureLayer;
            this.initZoomPlugin();
        });
    }
}

export default Map;
