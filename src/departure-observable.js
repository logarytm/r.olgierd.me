import parseXMLString from './parse-xml-string';
import fetchWithCors from './fetch-with-cors';
import map from 'ramda/src/map';
import applyTo from 'ramda/src/applyTo';

function convertDepartures(rootNode) {
    return map(function convertSingleDeparture(departureNode) {
        const vehicleAttributes = departureNode.getAttribute('vuw');

        return {
            line: departureNode.getAttribute('nr'),
            direction: departureNode.getAttribute('dir'),
            hasTicketMachine: vehicleAttributes.includes('B'),
            time: departureNode.querySelector('S').getAttribute('t').replace('<1min', '<1 min'),
        };
    }, rootNode.querySelectorAll('R'));
}

export default function createDepartureObservable(stopId, { refreshInterval }) {
    const timer = setInterval(refresh, refreshInterval * 1000);
    const observers = [];

    function observe(f) {
        observers.push(f);
    }

    function stop() {
        clearInterval(timer);
    }

    function refresh() {
        return fetchWithCors(`http://einfo.erzeszow.pl/Home/GetTimetableReal?busStopId=${stopId}`)
            .then(response => response.text())
            .then(parseXMLString)
            .then(convertDepartures)
            .then(departures => Promise.all(map(applyTo(departures), observers)));
    }

    return {
        observe,
        stop,
        refresh,
    };
}
