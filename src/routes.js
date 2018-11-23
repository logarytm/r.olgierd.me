import * as R from 'ramda';

import CachedRepository from '~/cached-repository.js';

import { default as originalStopRepository } from '~/stop-repository.js';
import createDepartureObservable from '~/departure-observable.js';

import showAllStops from '~/show-all-stops.js';
import showDepartures from '~/show-departures.js';
import searchStops from '~/search-stops.js';
import reloadStops from '~/reload-stops.js';

const stopRepository = CachedRepository(originalStopRepository, {
    repositoryName: 'stop-repository',
    methods: {
        findAllByStreets: {
            cacheTTL: 24 * 60 * 60 * 14,
            expired: 'use-cached',
        },
        getSpoilers: {
            cacheTTL: 24 * 60 * 60 * 30,
            expired: 'use-cached',
        },
    },
});

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
        path: '/refresh',
        action: R.partial(reloadStops, [{ stopRepository }]),
    },
    {
        path: '/departures/from-stop/:id',
        action: R.partial(showDepartures, [{
            createDepartureObservable,
            stopRepository,
        }]),
    },
];
