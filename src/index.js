import UniversalRouter from 'universal-router';

import routes from './routes';
import './index.scss';

import './boot/polyfills';
import Application from './boot/application';

const isLegacyBrowser =
    typeof window.Promise !== 'function'
    || typeof window.fetch !== 'function';

if (isLegacyBrowser) {
    import(/* webpackChunkName: "shim" */ './boot/shim')
        .then(boot)
        .catch(console.error);
} else {
    boot();
}

function boot() {
    const router = new UniversalRouter(routes);
    const application = new Application(router);
    application.boot();
}
