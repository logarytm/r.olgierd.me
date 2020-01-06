import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

import mountNode from './mount-node';
import { setSearchIconTarget } from './ui/global-state';

import ticketsIcon from './tickets.svg';
import { notice } from './ui/notice';
import Dom from './misc/dom';

const REFRESH_INTERVAL = 5;

const hx = hyperx(hyperscript);

export default function showDepartures(
    {
        createDepartureObservable,
        stopRepository,
    },
    { params },
) {
    setSearchIconTarget('/stops');

    params.id = parseInt(params.id, 10);

    let lastRefreshedAt = null;
    let refreshTimer = null;

    const observable = createDepartureObservable(params.id, { refreshInterval: REFRESH_INTERVAL });
    observable.observe(renderNewDepartures);
    observable.refresh();

    const root = Dom.el('div');

    const notifyDoneLoading = notice('Ładowanie…');

    function DepartureRow(departure) {
        const icons = [];

        if (departure.hasTicketMachine) {
            icons.push(Dom.el('img.icon.icon--tickets', { src: ticketsIcon, alt: 'Autobus ma biletomat' }));
        }

        return Dom.el('tr.departure-table__row', [
            Dom.el('td.departure-table__line', [departure.line]),
            Dom.el('td.departure-table__direction', {
                className: [departure.direction.length > 30 ? 'departure-table__direction--long' : null],
            }, [
                Dom.el('span', [departure.direction]),
                ...icons,
            ]),
            Dom.el('td.departure-table__time', [departure.time]),
        ]);
    }

    function DepartureTable(departures) {
        return Dom.el('div', [
            Dom.el('table.departure-table', departures.map(DepartureRow)),
        ]);
    }

    function updateNotice() {
        const now = new Date();
        let minutesSinceRefresh = Math.floor((now - lastRefreshedAt) / (1000 * 60));
        if (lastRefreshedAt === null || minutesSinceRefresh < 60) {
            return;
        }

        notice(`Nieaktualne dane (<a href="${window.location.pathname}">odśwież teraz</a>).`);
    }

    function renderNewDepartures(departures) {
        notifyDoneLoading();
        lastRefreshedAt = new Date();

        if (!refreshTimer) {
            refreshTimer = setInterval(updateNotice, 120 * 1000);
        }

        mountNode(DepartureTable(departures), root);
    }

    return stopRepository.getNameById(params.id)
        .then(name => {
            return {
                title: name,
                html: root,
                didUnmount() {
                    observable.stop();
                    clearInterval(refreshTimer);
                },
            };
        });
}
