const themeColors = {
    offline: '#111',
    online: '#039',
};

function setThemeColor(selection) {
    document.querySelector('meta[name=theme-color]').setAttribute('content', themeColors[selection]);
    document.querySelector('.navbar').style.backgroundColor = themeColors[selection];
}

export function leaveOfflineState() {
    document.documentElement.classList.remove('offline');
    setThemeColor('online');
}

export function enterOfflineState() {
    document.documentElement.classList.add('offline');
    setThemeColor('offline');
}

export function setSearchIconTarget(url) {
    document.querySelector('.search-link').href = url;
}

window.addEventListener('online', leaveOfflineState);
window.addEventListener('offline', enterOfflineState);
