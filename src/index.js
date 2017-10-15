import 'es6-promise';
import 'whatwg-fetch';

import UniversalRouter from 'universal-router';

import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

import StopRepository from '~/stop-repository.js';
import StopListByStreet from '~/stop-list-by-street.js';
import createDepartureObservable from '~/departure-observable.js';
import mountNode from '~/mount-node.js';

import '~/index.scss';

const hx = hyperx(hyperscript);
const root = hx`
    <div id="main"></div>
  `;
document.body.appendChild(root);

const routes = [
  {
    path: '/',
    action() {
      return StopRepository
        .allByStreets()
        .then(streets => StopListByStreet(streets));
    },
  },
  {
    path: '/:id',
    action({ params }) {
      // We need the departures to refresh in place, so we create and return a
      // root node which we then update when new data arrives. This is a bit
      // hacky and maybe may be done in a better way?
      //
      // FIXME: Call observable.stop() after finishing this action.

      const observable = createDepartureObservable(params.id, { refreshInterval: 30 });
      observable.observe(renderNewDepartures);
      observable.refresh();

      const destination = hx`<div></div>`;

      function DepartureRow(departure) {
        return hx`
          <tr class="departure-table__row">
            <td class="departure-table__line">${departure.line}</td>
            <td class="departure-table__direction">${departure.direction}</td>
            <td class="departure-table__time">${departure.time}</td>
          </tr>
        `;
      }

      function DepartureTable(departures) {
        return hx`
          <table class="departure-table">
            ${departures.map(DepartureRow)}
          </table>
        `;
      }

      function renderNewDepartures(departures) {
        mountNode(DepartureTable(departures), destination);
      }

      return destination;
    },
  },
];

const router = new UniversalRouter(routes);

router.resolve(window.location).then((html) => {
  document.querySelector('#main').innerHTML = '';
  document.querySelector('#main').appendChild(html);
});
