$(document).ready(function() {

    const { ipcRenderer } = require('electron');

    ipcRenderer.send('app_version');

    ipcRenderer.on('app_version', (event, val) => {
      ipcRenderer.removeAllListeners('app_version');
      $("footer").text(val.version);
    });

    ipcRenderer.on('update_available', () => {
        ipcRenderer.removeAllListeners('update_available');
        $("#message").text('A new update is available. Downloading now...');
        $("#notification").removeClass("hidden");
    });

    ipcRenderer.on('update_downloaded', () => {
        ipcRenderer.removeAllListeners('update_downloaded');
        $("#message").text('Update Downloaded. It will be installed on restart. Restart now?');
        $("#notification").removeClass("hidden");
        $("#restart-button").removeClass("hidden");
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