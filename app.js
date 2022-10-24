const server = require('./include/webServer');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const config = require('./include/config.json');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        center: true,
        show: false
    });

    const loadingWindow = new BrowserWindow({
        width: 300,
        height: 300,
        minWidth: 300,
        minHeight: 300,
        center: true,
        frame: false,
        resizable: false,
        backgroundColor: '#101010',
        show: true
    });

    if (server.workspace.isCreated()) {
        mainWindow.once('ready-to-show', () => {
            loadingWindow.close();
            mainWindow.show();
        });
        mainWindow.loadURL(`http://127.0.0.1:${config.PORT}`);
    } else {
        const setupWindow = new BrowserWindow({
            width: 800,
            height: 600,
            minWidth: 800,
            minHeight: 600,
            center: true,
            show: false,
            webPreferences: {
                preload: path.join(__dirname, '/include/preload.js')
            }
        });
        setupWindow.loadURL("https://webetud.iut-blagnac.fr/login/index.php");
        setupWindow.once('ready-to-show', () => {
            setupWindow.show();
        });
        const { ipcMain } = require('electron');
        ipcMain.on('setup', (event, arg) => {
            mainWindow.loadURL(`http://127.0.0.1:${config.PORT}/setup/${arg}`);
            loadingWindow.close();
            setupWindow.close();
            mainWindow.show();
        });
    }
    loadingWindow.loadFile('./views/loading.html');
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