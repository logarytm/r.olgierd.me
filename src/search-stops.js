import StopList from '~/stop-list.js';
import mountNode from '~/mount-node.js';

import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

const hx = hyperx(hyperscript);

export default function searchStops({ stopRepository }) {
  const root = hx`<div>
    <input class="stop-search__input" type="text" autofocus />
    <div class="stop-search__stops"></div>
  </div>`;

  const input = root.querySelector('.stop-search__input');
  const destination = root.querySelector('.stop-search__stops');

  input.addEventListener('input', debounce(() => {
    stopRepository.allMatching(input.value).then(stops => {
      replaceStops(stops);
    });
  }, 250));

  function replaceStops(stops) {
    mountNode(StopList(stops), destination);
  }

  stopRepository.all()
    .then((stops) => {
      replaceStops(stops);
    });

  return root;
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
