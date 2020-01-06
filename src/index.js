import UniversalRouter from 'universal-router';

import routes from './routes';
import onTargetsMatchingSelector from './on-targets-matching-selector';

const router = new UniversalRouter(routes);

import './index.scss';
import { closeNotice } from './ui/notice';

window.addEventListener('click', onTargetsMatchingSelector('a[href]', e => {
    if (e.target.host === window.location.host && e.button === 0) {
        navigate(e.target.pathname);

        e.preventDefault();
        return false;
    }
}));

window.addEventListener('popstate', e => {
    resolve(e.state);
});

function navigate(path) {
    return resolve(path)
        .then(() => {
            history.pushState(path, document.title, path);
        });
}

let currentView = null;

function resolve(path) {
    return router.resolve(path).then((newView) => {
        let { title, html } = newView;

        closeNotice();

        document.title = title;
        document.querySelector('#title').textContent = title;

        callHookIfExists(currentView, 'willUnmount');

        document.querySelector('#main').innerHTML = '';

        callHookIfExists(currentView, 'didUnmount');

        document.querySelector('#main').appendChild(html);

        callHookIfExists(newView, 'didMount');

        currentView = newView;
    });

    function callHookIfExists(view, hook) {
        if (typeof view === 'object' && view !== null && view.hasOwnProperty(hook) && typeof view[hook] === 'function') {
            console.log(`calling hook: ${hook}`);
            view[hook]();
        }
    }
}

if (navigator.userAgent.includes('Windows NT')) {
    document.body.style.fontFamily = 'Arial, Helvetica, sans-serif';
}

if (navigator.userAgent.includes('Android')) {
    document.documentElement.classList.add('android');
}

resolve(window.location)
    .then(() => {
        history.replaceState(
            window.location.pathname,
            document.title,
            window.location.pathname);
    });
