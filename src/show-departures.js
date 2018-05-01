import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

import mountNode from '~/mount-node.js';

const hx = hyperx(hyperscript);

export default function showDepartures({
  createDepartureObservable,
  stopRepository,
}, { params }) {

  params.id = parseInt(params.id, 10);

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
        <td class="departure-table__direction ${departure.direction.length > 30 ? 'departure-table__direction--long' : ''}"><span>${departure.direction}</span></td>
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

  return stopRepository.getNameById(params.id)
    .then(name => {
      return {
        title: name,
        html: destination,
      };
    });
}
