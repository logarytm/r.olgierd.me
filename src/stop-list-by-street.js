import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

import onTargetsMatchingSelector from '~/on-targets-matching-selector.js';

const hx = hyperx(hyperscript);

export default function StopListByStreet(streets, loadSpoilersForStreet) {
    const html = hx`
        <ul class="stops">
            ${streets.map((street, index) => hx`
                <li class="stops__street-item">
                    <button class="stops__street-name" type="button">${street.name}</button>
                    <ul class="u-hidden stops__per-street-list" data-street-name="${street.name}" data-street-index="${index}">
                        ${street.stops.map(stop => hx`
                            <li class="stops__stop-item" data-stop-id="${stop.id}">
                                <a class="stops__stop-name" href="/departures/from-stop/${stop.id}">${stop.name}</a>
                            </li>
                        `)}
                    </ul>
                </li>`,
    )}
        </ul>
    `;

    html.addEventListener('click', onTargetsMatchingSelector('.stops__street-name', toggleStreet));

    const spoilersLoaded = {};

    function toggleStreet(e) {
        const street = e.target.parentNode.querySelector('.stops__per-street-list');

        e.target.classList.toggle('stops__street-name--expanded');
        e.target.blur();
        street.classList.toggle('u-hidden');

        let streetName = street.getAttribute('data-street-name');
        if (spoilersLoaded[streetName]) {
            return;
        }

        const directionLengthLimit = 30;

        loadSpoilersForStreet(streetName, spoiler => {
            const stopItem = street.querySelector(`[data-stop-id="${spoiler.id}"]`);
            if (!stopItem) {
                return;
            }

            stopItem.classList.add('stops__stop-item--spoilers');

            stopItem.querySelector('.stops__stop-name').appendChild(hx`
                <div class="stops__stop-spoilers">${spoiler.spoilers.map(({ line, direction }, index) => {
                    if (direction.length > directionLengthLimit) {
                        direction = direction.replace(/\s.*$/, '') + '…';
                    }
    
                    const separator = index === 0 ? '' : ', ';
                    
                    return hx`<span class="stops__stop-spoiler">${separator}${line}<span class="stops__stop-spoiler-arrow">→</span>${direction}</span>`;
                })}</div>
            `);
        });

        spoilersLoaded[streetName] = true;
    }

    return html;
};
