import StopList from './stop-list';
import mountNode from './mount-node';

import { setSearchIconTarget } from './ui/global-state';
import Dom from './misc/dom';

export default function searchStops({ stopRepository }) {
    const root = Dom.el('div.stop-search', [
        Dom.el('div.stop-search__input-wrap', [
            Dom.el('input.stop-search__input', {
                type: 'text',
                placeholder: 'Nazwa przystanku, ulica',
                autofocus: true,
            }),
        ]),
        Dom.el('div.stop-search__stops'),
    ]);

    const input = root.querySelector('.stop-search__input');
    const destination = root.querySelector('.stop-search__stops');

    setSearchIconTarget('/');

    input.addEventListener('input', debounce(() => {
        stopRepository.findAllMatching(input.value).then(replaceStops);
    }, 250));

    function replaceStops(stops) {
        mountNode(StopList(stops, stopRepository.getSpoilers.bind(stopRepository)), destination);
    }

    stopRepository.findAll()
        .then((stops) => {
            replaceStops(stops);
            input.focus();
        });

    return { title: 'Szukaj przystanków', html: root, didMount: () => input.focus() };
}

// https://remysharp.com/2010/07/21/throttling-function-calls
function debounce(fn, delay) {
    let timer = null;
    return function debounced(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}
