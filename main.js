const setupEvents = require('./installer/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
   return;
}
process.env.NODE_ENV = "production"
const url = require("url");
const { join } = require("path");
const { app, BrowserWindow, ipcMain, autoUpdater, dialog } = require("electron");
const fs = require('fs-extra');
const { exec } = require('child_process');
const server = "https://amp-roleplay-client.now.sh"
const feed = `${server}/update/win32/${app.getVersion()}`
autoUpdater.setFeedURL(feed)
let mainWindow;
app.allowRendererProcessReuse = true;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 800,
        frame: false,
        icon: join(__dirname, "build", "amp-logo.png"),
        webPreferences: { nodeIntegration: true, backgroundThrottling: false }
    });
    mainWindow.loadURL(url.format({
        pathname: join(__dirname, "html", "main.html"),
        protocol: "file:",
        slashes: true
    }));
    mainWindow.setMenu(null);
    autoUpdater.checkForUpdates();
});

ipcMain.on("server:submit", (e, val) => {
    let newWindow;
    if (val == "main") {
        let newWindow = new BrowserWindow({
            frame: false,
            focusable: false,
            transparent: true,
            alwaysOnTop: true,
            fullscreen: true
        })
        newWindow.loadURL("fivem://connect/142.11.200.194:30121");
        newWindow.setIgnoreMouseEvents(true);
        exec("tasklist", (err, stdout, stderr) => {
            let query = "ts3client_win64.exe"
            let query2 = "ts3client_win32.exe"
            let isRunning = ((stdout.toLowerCase().indexOf(query.toLowerCase()) > -1) || stdout.toLowerCase().indexOf(query2.toLowerCase()) > -1) ? true : false;
            if (isRunning) return;
            let newWindow2 = new BrowserWindow({
                frame: false,
                focusable: false,
                transparent: true,
                alwaysOnTop: true,
                fullscreen: true
            })
            newWindow2.loadURL("ts3server://teamspeak.amproleplay.com?password=pC2haoYK");
            newWindow2.setIgnoreMouseEvents(true);
        });

    }
    if (val == "test") {
        let newWindow = new BrowserWindow({
            frame: false,
            focusable: false,
            transparent: true,
            alwaysOnTop: true,
            fullscreen: true
        })
        newWindow.loadURL("fivem://connect/142.11.200.194:30120");
        newWindow.setIgnoreMouseEvents(true);
        exec("tasklist", (err, stdout, stderr) => {
            let query = "ts3client_win64.exe"
            let query2 = "ts3client_win32.exe"
            let isRunning = ((stdout.toLowerCase().indexOf(query.toLowerCase()) > -1) || stdout.toLowerCase().indexOf(query2.toLowerCase()) > -1) ? true : false;
            if (isRunning) return;
            let newWindow2 = new BrowserWindow({
                frame: false,
                focusable: false,
                transparent: true,
                alwaysOnTop: true,
                fullscreen: true
            })
            newWindow2.loadURL("ts3server://teamspeak.amproleplay.com?password=pC2haoYK");
            newWindow2.setIgnoreMouseEvents(true);
        });
    }

    if (val == "cache") {
        let appdata = app.getPath("appData");
        let fivemPath = join(appdata, "..", "Local", "FiveM", "FiveM.app", "cache");
        fs.remove(fivemPath).then(() => {
          }).catch(err => {
            console.error(err)
          });
    }

    if (val == "website") {
        newWindow = new BrowserWindow({
            icon: join(__dirname, "build", "amp-logo.png")
        });
        newWindow.loadURL('http://amproleplay.com');
        newWindow.setMenu(null);
        newWindow.maximize();
    }

    if (val == "twitter") {
        newWindow = new BrowserWindow({
            icon: join(__dirname, "build", "amp-logo.png")
        });
        newWindow.loadURL('https://twitter.com/amplifyrp/');
        newWindow.setMenu(null);
        newWindow.maximize();
    }

    if (val == "close") {
        mainWindow = null;
        newWindow = null;
        newWindow2 = null;
        app.exit();
    }
});

autoUpdater.on('update-available', (event) => {
    const dialogOpts = {
      type: 'info',
      buttons: ["Okay"],
      title: 'Update Available',
      message: "",
      detail: 'A new version is available, downloading now....'
    }
  
    dialog.showMessageBox(dialogOpts);
});

autoUpdater.on('update-downloaded', (event) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: "",
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }
  
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
});

autoUpdater.on('error', err => {
    const dialogOpts = {
        type: 'info',
        buttons: ["Okay"],
        title: 'Application Error',
        message: "",
        detail: err.message
      }
      dialog.showMessageBox(dialogOpts);
});


ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});