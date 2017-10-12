import * as R from 'ramda';

import CachedRepository from '~/cached-repository.js';

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
});
