import 'es6-promise';
import 'whatwg-fetch';

import '~/scss/main.scss';

import UniversalRouter from 'universal-router';

import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

import { allStops } from '~/stops.js';

allStops().then(console.log);

const hx = hyperx(hyperscript);
const chrome = (function createChrome() {
  return hx`
    <div id="viewport"></div>
  `;
}());
document.body.appendChild(chrome);

const routes = [
  {
    path: '/',
    action: () => '<h1>Home</h1>',
  },
];

const router = new UniversalRouter(routes);

router.resolve(window.location).then((html) => {
  document.querySelector('#viewport').innerHTML = html;
});
