const url = require("url");
const { join } = require("path");
const { ENVIRONMENT } = process.env;
const { app, BrowserWindow, ipcMain, autoUpdater, dialog } = require("electron");
const fs = require('fs-extra');
require('update-electron-app')()

let mainWindow;
app.allowRendererProcessReuse = true;
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 1204, 
        height: 677,
        icon: join(__dirname, "build", "amp-logo.png"),
        webPreferences: { nodeIntegration: true, backgroundThrottling: false }
    });
    mainWindow.loadURL(url.format({
        pathname: join(__dirname, "html", "main.html"),
        protocol: "file:",
        slashes: true
    }));

    mainWindow.setMenu(null);
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
    }

    if (val == "changelog") {

        newWindow = new BrowserWindow({
            width: 1500, 
            height: 800,
            icon: join(__dirname, "build", "amp-logo.png"),
            webPreferences: { nodeIntegration: true, backgroundThrottling: false }
        });
        newWindow.loadURL(url.format({
            pathname: join(__dirname, "html", "changelog.html"),
            protocol: "file:",
            slashes: true
        }));
        newWindow.setMenu(null);
    }

    if (val == "rules") {

        newWindow = new BrowserWindow({
            width: 1500, 
            height: 800,
            icon: join(__dirname, "build", "amp-logo.png"),
            webPreferences: { nodeIntegration: true, backgroundThrottling: false }
        });
        newWindow.loadURL(url.format({
            pathname: join(__dirname, "html", "rules.html"),
            protocol: "file:",
            slashes: true
        }));
        newWindow.setMenu(null);

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
})

if (ENVIRONMENT == "production") {
    const server = 'http://downloads.amproleplay.com'
    const feed = `${server}/update/${process.platform}/${app.getVersion()}`
    autoUpdater.setFeedURL(feed)
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