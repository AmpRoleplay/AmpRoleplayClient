$(document).ready(function() {

    const { ipcRenderer } = require('electron');

    $("#mainserver").click(function() {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            return;
        }
        if (!$(this).hasClass("selected")) {
            $(this).addClass("selected");
            $("#testserver").removeClass("selected");
            return;
        }
    });

    $("#testserver").click(function() {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            return;
        }
        if (!$(this).hasClass("selected")) {
            $(this).addClass("selected");
            $("#mainserver").removeClass("selected");
            return;
        }
    });

    $("#launch").click(function() {
        if ($("#mainserver").hasClass("selected")) {
            ipcRenderer.send("server:submit", "main");
        } else if ($("#testserver").hasClass("selected")) {
            ipcRenderer.send("server:submit", "test");
        }
    });

    $("#changelog").click(function() {
        ipcRenderer.send("server:submit", "changelog");
    })

    $("#rules").click(function() {
        ipcRenderer.send("server:submit", "rules");
    })

    $("#cache").click(function() {
        ipcRenderer.send("server:submit", "cache");
    })

    $("#website").click(function() {
        ipcRenderer.send("server:submit", "website");
    })

});