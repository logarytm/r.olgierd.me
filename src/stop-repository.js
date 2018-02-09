import * as R from 'ramda';

import createFuzzySearch from '~/fuzzy-search.js';
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

    return fetch('https://cors-anywhere.herokuapp.com/http://einfo.erzeszow.pl/Home/GetBusStopList?q=&ttId=0')
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

  findAllMatching(string) {
    if (string.trim() === '') {
      return this.findAll();
    }

    return this.findAll()
      .then((stops) => {
        if (globalSearch === null) {
          globalSearch = createFuzzySearch(R.map(stop =>
            R.merge(stop, { name: stop.name }), stops));
        }

        return globalSearch(string, {
          inclusionThreshold: 0.95,
        });
      });
  },
};
