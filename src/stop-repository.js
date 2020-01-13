import pipe from 'ramda/src/pipe';
import prop from 'ramda/src/prop';
import map from 'ramda/src/map';
import flatten from 'ramda/src/flatten';

import fetchWithCors from './fetch-with-cors';

export default {
    findAllByStreets() {
        const convertSingleStop = function convertSingleStop([id, name]) {
            return { id, name };
        };

        const convertSingleStreet = function convertSingleStreet([_, name, stops]) {
            return {
                name,
                stops: map(convertSingleStop, stops),
            };
        };

        const convertStops = map(convertSingleStreet);

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
            .then(pipe(
                map(prop('stops')),
                flatten,
            ));
    },

    loadSpoilersForStreet(name, consumer) {
        const stopNameNumberRegExp = /^(.*?)\s+(\d+?)$/;
        const stopNameIndex = 1;

        return this.findByStreet(name)
            .then(stops => {
                const seen = {};
                const sameName = {};

                stops.forEach(stop => {
                    const match = stopNameNumberRegExp.exec(stop.name);

                    // as an example, if the stop name is "Piłsudskiego
                    const basicName = match ? match[stopNameIndex] : stop.name;

                    if (!seen[basicName]) {
                        seen[basicName] = { name: basicName, id: stop.id };
                    } else {
                        if (!sameName[basicName]) {
                            sameName[basicName] = [seen[basicName]];
                        }

                        sameName[basicName].push({ name: basicName, id: stop.id });
                    }
                });

                return Object.keys(sameName)
                    .map(name => sameName[name])
                    .reduce((a, b) => [...a, ...b], []);
            })
            .then(stops => {
                stops.forEach(stop => {
                    this.getSpoilers(stop.id).then(spoilers => {
                        consumer({ id: stop.id, spoilers });
                    });
                });
            });
    },

    findByStreet(streetName) {
        return this.findAllByStreets()
            .then(streets => {
                const street = streets.find(street => street.name === streetName);

                return street ? street.stops : null;
            });
    },

    getSpoilers(stopId, { limit = 2 } = {}) {
        return fetchWithCors(`http://einfo.erzeszow.pl/Home/GetBusStopRouteList?id=${stopId}&ttId=0`)
            .then(response => response.json())
            .then(response => {
                const tasks = [];

                if (
                    !Array.isArray(response)
                    || response.length < 5
                    || !Array.isArray(response[4])
                    || response[4].length < 2
                ) {
                    return [];
                }

                const routes = response[4][1];
                if (!Array.isArray(routes) || routes.length < 1) {
                    return;
                }

                for (let i = 0; i < routes.length && i < 2 * limit; i += 2) {
                    const routeId = routes[i];
                    const line = String(routes[i + 1]);

                    tasks.push(
                        fetchWithCors(`http://einfo.erzeszow.pl/Home/GetBusStopTimeTable?busStopId=${stopId}&routeId=${routeId}&ttId=0`)
                            .then(response => response.json())
                            .then(json => ({ json, line })),
                    );
                }

                return Promise.all(tasks);
            })
            .then(spoilers => {
                return spoilers
                    .map(({ line, json }) => {
                        if (!Array.isArray(json) || json.length < 3) {
                            return;
                        }

                        const allRoutes = json[2];
                        if (allRoutes.length < 1) {
                            return;
                        }

                        const direction = allRoutes[0][3];

                        return { line, direction };
                    })
                    .filter(spoiler => spoiler !== undefined);
            });
    },

    findAllMatching(query) {
        if (query.trim() === '') {
            return this.findAll();
        }

        query = query.toLowerCase();

        return this.findAll()
            .then((stops) => {
                return stops.filter(stop =>
                    stop.name.toLowerCase().includes(query));
            });
    },
};
