import Dom from './misc/dom';
import { notice } from './ui/notice';

export default function reloadStops({ stopRepository }) {
    notice('Odświeżanie listy przystanków…');

    const root = Dom.el('div.reload-stops');

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
