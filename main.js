const setupEvents = require('./installer/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
   return;
}

const url = require("url");
const { join } = require("path");
const { app, BrowserWindow, ipcMain, autoUpdater, dialog } = require("electron");
const fs = require('fs-extra');
require('update-electron-app')()
process.env.NODE_ENV = "production"
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