import { init } from '../../sGis/dist/init.js';

class Map {
    constructor() {
        this.init();
    }
    fetchData() {
        return fetch('./fairytale.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                return json;
            })
            .catch(function(ex) {
                return ex;
            });
    }
    init() {
        console.log('--> init', init);
        this.fetchData().then(function(data) {
            console.log('--> data', data);
        });
    }
}

export default Map;
