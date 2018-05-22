export default function onTargetsMatchingSelector(selector, listener) {
    return function checkEventTarget(e) {
        if (e.target.matches(selector)) {
            return listener(e);
        }

        return true;
    };
}
