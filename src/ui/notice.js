export function notice(innerHTML) {
    const $notice = document.querySelector('.notice');

    // if there's no DOM node for notice text, show an alert() instead
    if ($notice == null) {
        alert(innerHTML);
        return;
    }

    $notice.classList.remove('notice--hidden');
    $notice.innerHTML = innerHTML;

    return closeNotice;
}

export function closeNotice() {
    const $notice = document.querySelector('.notice');

    if ($notice == null) return;

    $notice.classList.add('notice--hidden');
    $notice.innerHTML = '';
}
