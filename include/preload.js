const ipcRenderer = require('electron').ipcRenderer;

function getCookie(cookieName) {
    let cookie = {};
    document.cookie.split(';').forEach(function (el) {
        let [key, value] = el.split('=');
        cookie[key.trim()] = value;
    })
    return cookie[cookieName];
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.href == "https://webetud.iut-blagnac.fr/") {
        let cookie = getCookie("MoodleSession");
        if (cookie != undefined) {
            ipcRenderer.send('setup', cookie);
        }
    }
});