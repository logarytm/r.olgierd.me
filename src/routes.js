import partial from 'ramda/src/partial';

import CachedRepository from './cached-repository';

import { default as originalStopRepository } from './stop-repository';
import createDepartureObservable from './departure-observable';

import showAllStops from './show-all-stops';
import showDepartures from './show-departures';
import searchStops from './search-stops';
import reloadStops from './reload-stops';

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
        action: partial(showAllStops, [{ stopRepository }]),
    },
    {
        path: '/stops',
        action: partial(searchStops, [{ stopRepository }]),
    },
    {
        path: '/refresh',
        action: partial(reloadStops, [{ stopRepository }]),
    },
    {
        path: '/departures/from-stop/:id',
        action: partial(showDepartures, [{
            createDepartureObservable,
            stopRepository,
        }]),
    },
];
