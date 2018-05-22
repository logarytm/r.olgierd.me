import * as R from 'ramda';
import fuzzysearch from 'fuzzysearch';

import fetchWithCors from '~/fetch-with-cors.js';
import CachedRepository from '~/cached-repository.js';

let globalSearch = null;
const stopNameCache = new Map();

export default {
    findAllByStreets() {
        const convertSingleStop = function convertSingleStop([id, name]) {
            return { id, name };
        };

        const convertSingleStreet = function convertSingleStreet([_, name, stops]) {
            return {
                name,
                stops: R.map(convertSingleStop, stops),
            };
        };

        const convertStops = R.map(convertSingleStreet);

        return fetchWithCors('http://einfo.erzeszow.pl/Home/GetBusStopList?q=&ttId=0')
            .then(response => response.json())
            .then(convertStops);
    },

    getNameById(id) {
        return this
            .findAll()
            .then(allStops => allStops.find(stop => stop.id === id).name);
    },

    findAll() {
        return this.findAllByStreets()
            .then(R.compose(R.flatten, R.map(R.prop('stops'))));
    },

    findAllMatching(query) {
        if (query.trim() === '') {
            return this.findAll();
        }

        query = query.toLowerCase();

        return this.findAll()
            .then((stops) => {
                return stops.filter(stop =>
                    fuzzysearch(query, stop.name.toLowerCase()));
            });
    },
};
