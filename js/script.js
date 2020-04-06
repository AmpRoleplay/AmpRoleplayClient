$(document).ready(function() {

    const { ipcRenderer } = require('electron');

    ipcRenderer.send('app_version');
    ipcRenderer.send('get_current_clients', "main");
    ipcRenderer.send('get_current_clients', "test"); 
    
    setInterval(() => {
        ipcRenderer.send('get_current_clients', "main");
        ipcRenderer.send('get_current_clients', "test"); 
    }, 15000);

    ipcRenderer.on('app_version', (event, val) => {
      ipcRenderer.removeAllListeners('app_version');
      $("footer").text(val.version);
    });

    ipcRenderer.on('log', (event, val) => {
        console.log(val);
    });

    ipcRenderer.on('get_current_clients_test', (event, val) => {
        $("#testplayerlist").text(val.players);
    });

    ipcRenderer.on('get_current_clients_main', (event, val) => {
        $("#mainplayerlist").text(val.players);
    });

    $("#mainserver").click(function() {
        if ($("#mainserver").hasClass("serverSelect")) {
            $("#mainserver").removeClass("serverSelect");
            return;
        }
        if (!$("#mainserver").hasClass("serverSelect")) {
            $("#mainserver").addClass("serverSelect");
            $("#testserver").removeClass("serverSelect");
            return;
        }
    });

    $("#testserver").click(function() {
        if ($("#testserver").hasClass("serverSelect")) {
            $("#testserver").removeClass("serverSelect");
            return;
        }
        if (!$("#testserver").hasClass("serverSelect")) {
            $("#testserver").addClass("serverSelect");
            $("#mainserver").removeClass("serverSelect");
            return;
        }
    });

    $("#launch").click(function() {
        if ($("#mainserver").hasClass("serverSelect")) {
            ipcRenderer.send("server:submit", "main");
        } else if ($("#testserver").hasClass("serverSelect")) {
            ipcRenderer.send("server:submit", "test");
        }
    });

    $("#servers").click(function() {
        $("#container").hide();
        $("#serverlist").show();
    });

    $("#changelog").click(function() {
        $("#serverlist").hide();
        $("#container").show();
        $("#ruleslist").hide();
        $("#changelogs").show();
    });

    $("#rules").click(function() {
        $("#serverlist").hide();
        $("#container").show();
        $("#changelogs").hide();
        $("#ruleslist").show();
    });

    $("#website").click(function() {
        ipcRenderer.send("server:submit", "website");
    });

    $("#twitter").click(function() {
        ipcRenderer.send("server:submit", "twitter");
    });

    $("#cache").click(function() {
        ipcRenderer.send("server:submit", "cache");
        alert("Cache has been cleared! Please relaunch FiveM to download cache again.");
    });

    $("#close").click(function() {
        ipcRenderer.send("server:submit", "close");
    });

    $("#arrowleft").click(function() {
        if ($("#patchlatest").is(":visible")) return;

        if ($("#patchprevious").is(":visible")) {
            $("#patchprevious").hide();
            $("#patchlatest").show();
        }
        if ($("#twopatchesago").is(":visible")) {
            $("#twopatchesago").hide();
            $("#patchprevious").show();
        }  
    });

    $("#arrowright").click(function() {
        if ($("#twopatchesago").is(":visible")) return;
        
        if ($("#patchprevious").is(":visible")) {
            $("#patchprevious").hide();
            $("#twopatchesago").show();
        }
        if ($("#patchlatest").is(":visible")) {
            $("#patchlatest").hide();
            $("#patchprevious").show();
        }
    });

    $("#close-button").click(function() {
        $("#notification").addClass("hidden");
    });
    $("#restart-button").click(function() {
        ipcRenderer.send('restart_app');
    });

});