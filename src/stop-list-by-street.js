import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

import onTargetsMatchingSelector from '~/on-targets-matching-selector.js';

const hx = hyperx(hyperscript);

function toggleStreet(e) {
    const street = e.target.parentNode.querySelector('.stops__per-street-list');

    e.target.classList.toggle('stops__street-name--expanded');
    e.target.blur();
    street.classList.toggle('u-hidden');
}

export default function StopListByStreet(streets) {
    const html = hx`
    <ul class="stops">
        ${streets.map((street, index) => hx`
            <li class="stops__street-item">
                <button class="stops__street-name" type="button">${street.name}</button>
                <ul class="u-hidden stops__per-street-list" data-street-index="${index}">
                    ${street.stops.map(stop => hx`
                        <li class="stops__stop-item"><a class="stops__stop-name" href="/departures/from-stop/${stop.id}">${stop.name}</a></li>
                    `)}
                </ul>
            </li>`,
    )}
    </ul>
    `;

    html.addEventListener('click', onTargetsMatchingSelector('.stops__street-name', toggleStreet));

    return html;
}
