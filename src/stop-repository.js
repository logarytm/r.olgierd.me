import * as R from 'ramda';

import createFuzzySearch from '~/fuzzy-search.js';
import CachedRepository from '~/cached-repository.js';

let globalFuzzySearch = null;

export default CachedRepository('stop', {
  cacheTTL: 24 * 60 * 60,

  allByStreets() {
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

  all() {
    return this.allByStreets()
      .then(R.compose(R.flatten, R.map(R.prop('stops'))));
  },

  allMatching(string) {
    if (string.trim() === '') {
      return this.all();
    }

    return this.all()
      .then((stops) => {
        if (globalFuzzySearch === null) {
          globalFuzzySearch = createFuzzySearch(R.map(stop =>
            R.merge(stop, { name: stop.name }), stops));
        }

        return globalFuzzySearch(string, {
          inclusionThreshold: 0.95,
        });
      });
  },
});
