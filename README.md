# AmpRoleplayClient


Make a release-builds folder within the main folder. Inside it, make a folder named "Amplify Launcher-win32-ia32" and a folder named windows-installer

To test, run "npm start" to see changes made

To build, make sure you update the package.json to the next version number, then run "npm run package-win". After its finished, run "npm run create-installer-win". Once successful, simply copy the newest package.json to the website and replace the .exe on the website with the one that is created inside the windows-installer folder