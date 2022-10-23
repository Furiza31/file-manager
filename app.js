const server = require('./webServer');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const config = require('./config.json');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        center: true
    });

    const loadingWindow = new BrowserWindow({
        width: 300,
        height: 300,
        minWidth: 300,
        minHeight: 300,
        center: true,
        frame: false,
        resizable: false,
        backgroundColor: '#101010'
    });

    mainWindow.once('ready-to-show', () => {
        loadingWindow.close();
        mainWindow.show();
    });

    loadingWindow.loadFile('./views/loading.html');
    mainWindow.loadURL(`http://127.0.0.1:${config.PORT}`);
}

app.whenReady().then(() => {
    server.start();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            reateWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});