import * as R from 'ramda';

import stopRepository from '~/stop-repository.js';
import createDepartureObservable from '~/departure-observable.js';

import showAllStops from '~/show-all-stops.js';
import showDepartures from '~/show-departures.js';
import searchStops from '~/search-stops.js';

export default [
  {
    path: '/',
    action: R.partial(showAllStops, [{ stopRepository }]),
  },
  {
    path: '/stops',
    action: R.partial(searchStops, [{ stopRepository }]),
  },
  {
    path: '/departures/from-stop/:id',
    action: R.partial(showDepartures, [{ createDepartureObservable }]),
  },
];
