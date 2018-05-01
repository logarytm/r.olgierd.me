import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

const hx = hyperx(hyperscript);

export default function StopList(stops) {
  return hx`
    <ul class="stop-list">
      ${stops.map(stop => hx`
        <li class="stop-list__item">
          <a class="stop-list__link" href="/departures/from-stop/${stop.id}">${stop.name}</a>
        </li>
      `)}
    </ul>
  `;
}
