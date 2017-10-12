import 'es6-promise';
import 'whatwg-fetch';

import UniversalRouter from 'universal-router';

import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

import StopRepository from '~/stop-repository.js';
import StopListByStreet from '~/stop-list-by-street.js';

import '~/index.scss';

console.log(StopRepository);

const hx = hyperx(hyperscript);
const root = hx`
    <div id="main"></div>
  `;
document.body.appendChild(root);

const routes = [
  {
    path: '/',
    action() {
      return StopRepository
        .allByStreets()
        .then(streets => StopListByStreet(streets));
    },
  },
];

const router = new UniversalRouter(routes);

router.resolve(window.location).then((html) => {
  document.querySelector('#main').innerHTML = '';
  document.querySelector('#main').appendChild(html);
});
