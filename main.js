const setupEvents = require('./installer/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
   return;
}
process.env.NODE_ENV = "production"
const url = require("url");
const { join } = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require('fs-extra');
const { exec } = require('child_process');
const updater = require('electron-simple-updater');
updater.init('https://raw.githubusercontent.com/AmpRoleplay/AmpRoleplayClient/master/updates.json');

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
    mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify();
    });
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
        app.exit();
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});