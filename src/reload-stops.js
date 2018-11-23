import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

const hx = hyperx(hyperscript);

export default function reloadStops({ stopRepository }) {
    const root = hx`<div class="reload-stops">
        <div class="notice">
            Odświeżanie listy przystanków…
        </div>
    </div>`;

    stopRepository
        .clear()
        .then(() => {
            return stopRepository.findAllByStreets();
        })
        .then(() => {
            window.location = '/';
        });

    return { title: 'Odświeżanie…', html: root };
}