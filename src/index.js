import 'es6-promise';
import 'whatwg-fetch';

import UniversalRouter from 'universal-router';

import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

import routes from '~/routes.js';

import '~/index.scss';

const hx = hyperx(hyperscript);

const router = new UniversalRouter(routes);

router.resolve(window.location).then(({ title, html }) => {
  document.title = title;
  document.querySelector('#title').textContent = title;
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
