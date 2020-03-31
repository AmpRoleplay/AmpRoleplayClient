const url = require("url");
const { join } = require("path");
const { ENVIRONMENT } = process.env;
const { app, BrowserWindow, ipcMain, autoUpdater, dialog } = require("electron");
require('update-electron-app')()

let mainWindow;
app.allowRendererProcessReuse = true;
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 1200, 
        height: 700,
        icon: join(__dirname, "build", "amp-logo.png"),
        webPreferences: { nodeIntegration: true, backgroundThrottling: false }
    });
    mainWindow.loadURL(url.format({
        pathname: join(__dirname, "mainWindow.html"),
        protocol: "file:",
        slashes: true
    }));

    mainWindow.setMenu(null);
});

ipcMain.on("server:submit", (e, val) => {
    if (val == "main") {
        let win = new BrowserWindow({
            frame: false,
            focusable: false,
            transparent: true,
            alwaysOnTop: true,
            fullscreen: true
        })
        win.loadURL("fivem://connect/142.11.200.194:30121");
        win.setIgnoreMouseEvents(true);
    }
    if (val == "test") {
        let win = new BrowserWindow({
            frame: false,
            focusable: false,
            transparent: true,
            alwaysOnTop: true,
            fullscreen: true
        })
        win.loadURL("fivem://connect/142.11.200.194:30120");
        win.setIgnoreMouseEvents(true);
    }
})

if (ENVIRONMENT == "production") {
    const server = 'http://downloads.amproleplay.com'
    const feed = `${server}/update/${process.platform}/${app.getVersion()}`
    setInterval(() => {
        autoUpdater.checkForUpdates()
    }, 60000);
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialogOpts = {
          type: 'info',
          buttons: ['Restart', 'Later'],
          title: 'Application Update',
          message: process.platform === 'win32' ? releaseNotes : releaseName,
          detail: 'A new version has been downloaded. Restart the application to apply the updates.'
        }
      
        dialog.showMessageBox(dialogOpts).then((returnValue) => {
          if (returnValue.response === 0) autoUpdater.quitAndInstall()
        })
      })
      autoUpdater.on('error', message => {
        console.error('There was a problem updating the application')
        console.error(message)
      })
}