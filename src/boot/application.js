import onTargetsMatchingSelector from '../on-targets-matching-selector';
import { closeNotice } from '../ui/notice';

export default class Application {
    constructor(router) {
        this.router = router;
        this.currentView = null;
    }

    boot() {
        window.addEventListener('click', onTargetsMatchingSelector('a[href]', e => {
            if (e.target.host === window.location.host && e.button === 0) {
                this.navigate(e.target.pathname);

                e.preventDefault();
                return false;
            }
        }));

        window.addEventListener('popstate', e => {
            this.resolve(e.state);
        });

        this.resolve(window.location.pathname)
            .then(() => {
                history.replaceState(
                    window.location.pathname,
                    document.title,
                    window.location.pathname);
            });
    }

    navigate(contextOrPathname) {
        return this.resolve(contextOrPathname)
            .then(() => {
                history.pushState(contextOrPathname, document.title, contextOrPathname);
            });
    }

    resolve(contextOrPathname) {
        return this.router.resolve(contextOrPathname)
            .then((newView) => {
                let { title, html } = newView;

                closeNotice();

                document.title = title;
                document.querySelector('#title').textContent = title;

                callHookIfExists(this.currentView, 'willUnmount');

                document.querySelector('#main').innerHTML = '';

                callHookIfExists(this.currentView, 'didUnmount');

                document.querySelector('#main').appendChild(html);

                callHookIfExists(newView, 'didMount');

                this.currentView = newView;
            });

        function callHookIfExists(view, hook) {
            if (typeof view === 'object' && view !== null && view.hasOwnProperty(hook) && typeof view[hook] === 'function') {
                console.log(`calling hook: ${hook}`);
                view[hook]();
            }
        }
    }
}
