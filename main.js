const setupEvents = require('./installer/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
   return;
}
process.env.NODE_ENV = "production"
const url = require("url");
const { join } = require("path");
const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const fs = require('fs-extra');
const { exec } = require('child_process');
const fetch = require("node-fetch");
const downloadFile = require('download-file');
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
    setTimeout(async () => {
        let checkUpdate = await fetch("http://amproleplay.com/downloads/newest/package.json", {method: "GET"}).then(res => res.json());
        if (checkUpdate.version > app.getVersion()) {
            let notify = new Notification({
                title: "Amplify Launcher Update",
                body: "A new update is available. Downloading now..."
            })
            notify.show();
            let appdata = app.getPath("appData");
            let downloadPath = join(appdata, "..", "Local");
            downloadFile("http://amproleplay.com/downloads/newest/amplifysetup.exe", {directory: downloadPath, filename: "amplifysetup.exe"}, function(err){
                if (err) {
                    console.log(err);
                }
                console.log("Downloaded")
                exec(join(downloadPath, "amplifysetup.exe"), (err, stdout, stderr) => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        }
    }, 5000);
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

        fs.readdir(fivemPath, (err, files) => {
            if (err) {
                console.log(err);
            }
            files.forEach(file => {
                const fileDir = join(fivemPath, file);
                if (file !== 'game') {
                    fs.remove(fileDir, err => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    })
                }
            });
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

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('get_current_clients', async (event, val) => {
    if (val == "test") {
        let info = await fetch("http://142.11.200.194:30120/info.json", {method: 'GET'}).then(res => res.json());
        if (!info) return event.sender.send('get_current_clients_test', { players: "OFFLINE" });
        let players = [] = await fetch("http://142.11.200.194:30120/players.json", {method: 'GET'}).then(res => res.json());
        let count = players.length;
        event.sender.send('get_current_clients_test', { players: `${count}/${parseInt(info.vars.sv_maxClients)}`});
    }

    if (val == "main") {
        let info = await fetch("http://142.11.200.194:30121/info.json", {method: 'GET'}).then(res => res.json());
        if (!info) return event.sender.send('get_current_clients_main', { players: "OFFLINE" });
        let players = [] = await fetch("http://142.11.200.194:30121/players.json", {method: 'GET'}).then(res => res.json());
        let count = players.length;
        event.sender.send('get_current_clients_main', { players: `${count}/${parseInt(info.vars.sv_maxClients)}` });
    }

});