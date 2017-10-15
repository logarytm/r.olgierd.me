import 'es6-promise';
import 'whatwg-fetch';

import UniversalRouter from 'universal-router';

import * as R from 'ramda';
import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

import stopRepository from '~/stop-repository.js';
import createDepartureObservable from '~/departure-observable.js';

import showAllStops from '~/show-all-stops.js';
import showDepartures from '~/show-departures.js';

import '~/index.scss';

const hx = hyperx(hyperscript);
const root = hx`
    <div id="main"></div>
  `;
document.body.appendChild(root);

const routes = [
  {
    path: '/',
    action: R.partial(showAllStops, [{ stopRepository }]),
  },
  {
    path: '/:id',
    action: R.partial(showDepartures, [{ createDepartureObservable }]),
  },
];

const router = new UniversalRouter(routes);

router.resolve(window.location).then((html) => {
  document.querySelector('#main').innerHTML = '';
  document.querySelector('#main').appendChild(html);
});

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function() {
//     navigator.serviceWorker.register('/sw.js').then(function(registration) {
//       // Registration was successful
//       console.log('ServiceWorker registration successful with scope: ', registration.scope);
//     }, function(err) {
//       // registration failed :(
//       console.log('ServiceWorker registration failed: ', err);
//     });
//   });
// }
