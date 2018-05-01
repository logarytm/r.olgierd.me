import * as R from 'ramda';
import parseXMLString from '~/parse-xml-string.js';
import fetchWithCors from '~/fetch-with-cors.js';

function convertDepartures(rootNode) {
  return R.map(function convertSingleDeparture(departureNode) {
    return {
      line: departureNode.getAttribute('nr'),
      direction: departureNode.getAttribute('dir'),
      time: departureNode.querySelector('S').getAttribute('t'),
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
      .then(departures => Promise.all(R.map(R.applyTo(departures), observers)));
  }

  return {
    observe,
    stop,
    refresh,
  };
}
