import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

const hx = hyperx(hyperscript);

export default function StopList(stops) {
  return hx`
    <ul>
      ${stops.map(stop => hx`
        <li><a href="/departures/from-stop/${stop.id}">${stop.name}</a></li>
      `)}
    </ul>
  `;
}
