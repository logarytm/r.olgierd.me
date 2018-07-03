import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

import mountNode from '~/mount-node.js';

import ticketsIcon from '~/tickets.svg';

const refreshInterval = 30;

const hx = hyperx(hyperscript);

export default function showDepartures(
    {
        createDepartureObservable,
        stopRepository,
    },
    { params },
) {

    params.id = parseInt(params.id, 10);

    let lastRefreshedAt = null;

    // We need the departures to refresh in place, so we create and return a
    // root node which we then update when new data arrives. This is a bit
    // hacky and maybe may be done in a better way?

    const observable = createDepartureObservable(params.id, { refreshInterval });
    observable.observe(renderNewDepartures);
    observable.refresh();

    setInterval(updateNotice, 10 * 1000);

    const destination = hx`<div><p class="notice">Loading…</p></div>`;

    function DepartureRow(departure) {
        const extraDirectionClass = departure.direction.length > 30 ? 'departure-table__direction--long' : '';
        const icons = [];

        if (departure.hasTicketMachine) {
            icons.push(hx`
                <img class="icon icon--tickets" src="${ticketsIcon}" alt="Biletomat">
            `);
        }

        return hx`
        <tr class="departure-table__row">
            <td class="departure-table__line">${departure.line}</td>
            <td class="departure-table__direction ${extraDirectionClass}">
                <span>${departure.direction}</span>
                ${icons}
            </td>
            <td class="departure-table__time">${departure.time}</td>
        </tr>
    `;
    }

    function DepartureTable(departures) {
        return hx`
        <div>
            <table class="departure-table">
                ${departures.map(DepartureRow)}
            </table>
            <p class="notice"></p>
        </div>
        `;
    }

    function updateNotice() {
        const now = new Date();
        let minutesSinceRefresh = Math.floor((now - lastRefreshedAt) / (1000 * 60));
        if (lastRefreshedAt === null || minutesSinceRefresh < 60) {
            return;
        }

        destination.querySelector('.notice').innerHTML =
            `Nieaktualne dane (<a href="${window.location.pathname}">odśwież teraz</a>).`;
    }

    function renderNewDepartures(departures) {
        lastRefreshedAt = new Date();

        mountNode(DepartureTable(departures), destination);
        updateNotice();
    }

    return stopRepository.getNameById(params.id)
        .then(name => {
            return {
                title: name,
                html: destination,
            };
        });
}
