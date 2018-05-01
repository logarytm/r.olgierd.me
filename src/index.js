import 'es6-promise';
import 'whatwg-fetch';

import UniversalRouter from 'universal-router';

import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

import routes from '~/routes.js';
import onTargetsMatchingSelector from '~/on-targets-matching-selector.js';

import '~/index.scss';

const hx = hyperx(hyperscript);

const router = new UniversalRouter(routes);

window.addEventListener('click', onTargetsMatchingSelector('a[href]', e => {
  if (e.target.host === window.location.host) {
    navigate(e.target.pathname);

    e.preventDefault();
    return false;
  }
}));

window.addEventListener('popstate', e => {
  navigate(e.state);
});

function navigate(path) {
  return resolve(path)
    .then(() => {
      history.pushState(path, document.title, path);
    });
}

function resolve(path) {
  return router.resolve(path).then(({ title, html }) => {
    document.title = title;
    document.querySelector('#title').textContent = title;
    document.querySelector('#main').innerHTML = '';
    document.querySelector('#main').appendChild(html);
  });
}

resolve(window.location);
