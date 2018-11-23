import StopList from '~/stop-list.js';
import mountNode from '~/mount-node.js';

import hyperscript from 'hyperscript';
import hyperx from 'hyperx';
import { setSearchIconTarget } from './global-state';

const hx = hyperx(hyperscript);

export default function searchStops({ stopRepository }) {
    const root = hx`<div class="stop-search">
        <div class="stop-search__input-wrap">
            <input class="stop-search__input" type="text" placeholder="Quo vadis?" autofocus />
        </div>
        <div class="stop-search__stops"></div>
    </div>`;

    const input = root.querySelector('.stop-search__input');
    const destination = root.querySelector('.stop-search__stops');

    setSearchIconTarget('/');

    input.addEventListener('input', debounce(() => {
        stopRepository.findAllMatching(input.value).then(replaceStops);
    }, 250));

    function replaceStops(stops) {
        mountNode(StopList(stops), destination);
    }

    stopRepository.findAll()
        .then((stops) => {
            replaceStops(stops);
            input.focus();
        });

    return { title: 'Szukaj przystanków', html: root };
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
